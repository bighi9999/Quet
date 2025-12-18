import { NextResponse } from 'next/server';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Utility function to convert bytes to GB
function bytesToGB(bytes: number): number {
  return parseFloat((bytes / (1024 ** 3)).toFixed(2));
}

// Utility function to format uptime
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
  
  return parts.length > 0 ? parts.join(' ') : 'Just started';
}

// Calculate CPU usage (average across all cores)
async function getCPUUsage(): Promise<number> {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;
  
  cpus.forEach(cpu => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times];
    }
    totalIdle += cpu.times.idle;
  });
  
  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  const usage = 100 - (100 * idle / total);
  
  return Math.round(usage);
}

// Get actual RAM + Swap info from system
async function getMemoryInfo() {
  try {
    // Get RAM + Swap info using 'free' command
    const { stdout } = await execPromise('free -b');
    const lines = stdout.trim().split('\n');
    
    // Parse RAM line (second line)
    const ramLine = lines[1].split(/\s+/);
    const totalRam = parseInt(ramLine[1]);
    const usedRam = parseInt(ramLine[2]);
    const freeRam = parseInt(ramLine[3]);
    
    // Parse Swap line (third line)
    const swapLine = lines[2].split(/\s+/);
    const totalSwap = parseInt(swapLine[1]);
    const usedSwap = parseInt(swapLine[2]);
    
    // Combined total (RAM + Swap)
    const totalMemory = totalRam + totalSwap;
    const usedMemory = usedRam + usedSwap;
    const freeMemory = totalMemory - usedMemory;
    
    return {
      totalRam,
      usedRam,
      freeRam,
      totalSwap,
      usedSwap,
      totalMemory,
      usedMemory,
      freeMemory
    };
  } catch (error) {
    // Fallback to os module if 'free' command fails
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    return {
      totalRam: totalMem,
      usedRam: usedMem,
      freeRam: freeMem,
      totalSwap: 0,
      usedSwap: 0,
      totalMemory: totalMem,
      usedMemory: usedMem,
      freeMemory: freeMem
    };
  }
}

// GET /api/system-health
export async function GET() {
  try {
    // Get memory info (including Swap)
    const memInfo = await getMemoryInfo();
    
    // Get CPU usage
    const cpuUsage = await getCPUUsage();
    
    // Get uptime
    const uptimeSeconds = os.uptime();
    
    // Get system info
    const platform = os.platform();
    const arch = os.arch();
    const hostname = os.hostname();
    const cpuCount = os.cpus().length;
    
    // Calculate RAM percentage (total including Swap)
    const ramUsagePercent = Math.round((memInfo.usedMemory / memInfo.totalMemory) * 100);
    
    // Determine health status
    let status = 'HEALTHY';
    if (cpuUsage > 90 || ramUsagePercent > 90) {
      status = 'CRITICAL';
    } else if (cpuUsage > 70 || ramUsagePercent > 70) {
      status = 'WARNING';
    }
    
    // Response object
    const healthData = {
      cpu_usage: cpuUsage,
      ram_used: bytesToGB(memInfo.usedMemory),
      ram_free: bytesToGB(memInfo.freeMemory),
      ram_total: bytesToGB(memInfo.totalMemory),
      ram_usage_percent: ramUsagePercent,
      ram_physical: {
        used: bytesToGB(memInfo.usedRam),
        total: bytesToGB(memInfo.totalRam),
        free: bytesToGB(memInfo.freeRam)
      },
      swap: {
        used: bytesToGB(memInfo.usedSwap),
        total: bytesToGB(memInfo.totalSwap)
      },
      uptime: formatUptime(uptimeSeconds),
      uptime_seconds: Math.floor(uptimeSeconds),
      status: status,
      system_info: {
        platform: platform,
        arch: arch,
        hostname: hostname,
        cpu_count: cpuCount,
        node_version: process.version
      },
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
    
  } catch (error) {
    console.error('System health check error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to retrieve system health',
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 'ERROR'
      },
      { status: 500 }
    );
  }
}
