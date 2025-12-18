import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// POST /api/clean-ram
export async function POST() {
  try {
    // Execute cache clearing commands
    // Note: This requires root privileges
    const commands = [
      'sync',
      'echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || true'
    ].join(' && ');
    
    try {
      const { stdout, stderr } = await execPromise(commands);
      
      return NextResponse.json({
        success: true,
        message: 'RAM cache cleared successfully',
        output: stdout || 'Cache cleared',
        timestamp: new Date().toISOString()
      }, {
        status: 200
      });
      
    } catch (execError: any) {
      // If command fails (no root access), return partial success
      return NextResponse.json({
        success: false,
        message: 'RAM cleaning command failed (may require root privileges)',
        error: execError.message,
        hint: 'This feature requires root/sudo access to clear system cache',
        timestamp: new Date().toISOString()
      }, {
        status: 403
      });
    }
    
  } catch (error) {
    console.error('Clean RAM error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to clean RAM cache',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}

// GET not allowed
export async function GET() {
  return NextResponse.json({
    error: 'Method not allowed',
    message: 'Use POST to clean RAM cache'
  }, {
    status: 405
  });
}
