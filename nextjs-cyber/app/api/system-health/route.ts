import { NextResponse } from 'next/server';
import os from 'os';

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

// GET /api/system-health
export async function GET() {
  try {
    // Get memory info
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    // Get CPU usage
    const cpuUsage = await getCPUUsage();
    
    // Get uptime
    const uptimeSeconds = os.uptime();
    
    // Get system info
    const platform = os.platform();
    const arch = os.arch();
    const hostname = os.hostname();
    const cpuCount = os.cpus().length;
    
    // Calculate RAM percentage
    const ramUsagePercent = Math.round((usedMem / totalMem) * 100);
    
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
      ram_used: bytesToGB(usedMem),
      ram_free: bytesToGB(freeMem),
      ram_total: bytesToGB(totalMem),
      ram_usage_percent: ramUsagePercent,
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
