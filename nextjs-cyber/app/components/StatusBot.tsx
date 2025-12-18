'use client';

import { useState, useEffect } from 'react';
import { Bot, X, Cpu, HardDrive, Activity, Zap, Trash2 } from 'lucide-react';

interface SystemStats {
  cpu: number;
  memory: number;
  memoryTotal: number;
  requests: number;
  uptime: string;
  status: string;
}

export default function StatusBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    memoryTotal: 0,
    requests: 0,
    uptime: '0h 0m',
    status: 'LOADING'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCleaningRAM, setIsCleaningRAM] = useState(false);

  // Fetch real system stats from API
  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('/api/system-health', {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch system health');
      }
      
      const data = await response.json();
      
      setStats({
        cpu: data.cpu_usage || 0,
        memory: data.ram_usage_percent || 0,
        memoryTotal: data.ram_total || 0,
        requests: Math.floor(Math.random() * 100) + 200, // Mock requests count
        uptime: data.uptime || '0h 0m',
        status: data.status || 'UNKNOWN'
      });
      
      setIsLoading(false);
      setError('');
    } catch (err) {
      console.error('Failed to fetch system health:', err);
      setError('Unable to fetch stats');
      setIsLoading(false);
    }
  };

  // Clean RAM function
  const handleCleanRAM = async () => {
    setIsCleaningRAM(true);
    try {
      const response = await fetch('/api/clean-ram', {
        method: 'POST',
        cache: 'no-store'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh stats immediately after cleaning
        await fetchSystemHealth();
      }
      
      // Show result (in a real app, use a toast library)
      const message = data.success 
        ? '✅ RAM cache cleared successfully!' 
        : `⚠️ ${data.message || 'Failed to clean RAM (requires root privileges)'}`;
      
      if (typeof window !== 'undefined') {
        window.alert(message);
      }
    } catch (err) {
      console.error('Clean RAM error:', err);
      if (typeof window !== 'undefined') {
        window.alert('❌ Failed to clean RAM cache');
      }
    } finally {
      setIsCleaningRAM(false);
    }
  };

  // Initial fetch and periodic updates every 3 seconds
  useEffect(() => {
    fetchSystemHealth();
    
    // Update every 3 seconds for real-time monitoring
    const interval = setInterval(() => {
      fetchSystemHealth();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Get color based on usage percentage
  const getUsageColor = (percent: number) => {
    if (percent > 90) return 'red';
    if (percent > 70) return 'yellow';
    return 'green';
  };

  // Get progress bar gradient
  const getProgressGradient = (percent: number) => {
    if (percent > 90) return 'bg-gradient-to-r from-red-500 to-orange-600';
    if (percent > 70) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-cyan-500 to-purple-600';
  };

  return (
    <>
      {/* Floating Bot Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full shadow-2xl shadow-cyan-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-label="Open System Monitor"
      >
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 animate-ping opacity-20"></div>
        
        {/* Bot Icon */}
        <Bot className="w-8 h-8 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Status Indicator */}
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-black animate-pulse ${
          stats.status === 'CRITICAL' ? 'bg-red-500' :
          stats.status === 'WARNING' ? 'bg-yellow-500' : 
          'bg-green-500'
        }`}></div>
      </button>

      {/* System Monitor Panel (Slide from Right) */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-xl border-l border-cyan-500/30 z-40
          transform transition-transform duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">System Monitor</h3>
              <p className="text-xs text-gray-400">Real-time VPS Stats</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-80px)]">
          {/* Status Message */}
          <div className={`bg-gradient-to-r rounded-lg p-4 border ${
            error 
              ? 'from-red-500/10 to-orange-500/10 border-red-500/30'
              : stats.status === 'CRITICAL'
              ? 'from-red-500/10 to-orange-500/10 border-red-500/30'
              : stats.status === 'WARNING'
              ? 'from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
              : 'from-cyan-500/10 to-purple-500/10 border-cyan-500/30'
          }`}>
            {error ? (
              <>
                <p className="text-sm text-red-400 font-medium">⚠️ Unable to fetch stats</p>
                <p className="text-xs text-gray-400 mt-1">{error}</p>
              </>
            ) : isLoading ? (
              <>
                <p className="text-sm text-gray-400 font-medium">⏳ Loading...</p>
                <p className="text-xs text-gray-400 mt-1">Fetching real-time data</p>
              </>
            ) : (
              <>
                <p className={`text-sm font-medium ${
                  stats.status === 'CRITICAL' ? 'text-red-400'
                  : stats.status === 'WARNING' ? 'text-yellow-400'
                  : 'text-cyan-400'
                }`}>
                  {stats.status === 'CRITICAL' ? '🔴 Critical - High Usage'
                   : stats.status === 'WARNING' ? '⚠️ Warning - Elevated'
                   : '✨ All systems operational'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Total RAM: {stats.memoryTotal.toFixed(1)}GB (Physical + Swap)
                </p>
              </>
            )}
          </div>

          {/* System Stats */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Live Metrics</h4>

            {/* CPU Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className={`w-4 h-4 ${
                    getUsageColor(stats.cpu) === 'red' ? 'text-red-400' :
                    getUsageColor(stats.cpu) === 'yellow' ? 'text-yellow-400' :
                    'text-cyan-400'
                  }`} />
                  <span className="text-sm text-gray-300">CPU Usage</span>
                </div>
                <span className={`text-sm font-bold ${
                  getUsageColor(stats.cpu) === 'red' ? 'text-red-400' :
                  getUsageColor(stats.cpu) === 'yellow' ? 'text-yellow-400' :
                  'text-cyan-400'
                }`}>
                  {stats.cpu}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getProgressGradient(stats.cpu)}`}
                  style={{ width: `${Math.min(stats.cpu, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HardDrive className={`w-4 h-4 ${
                    getUsageColor(stats.memory) === 'red' ? 'text-red-400' :
                    getUsageColor(stats.memory) === 'yellow' ? 'text-yellow-400' :
                    'text-purple-400'
                  }`} />
                  <span className="text-sm text-gray-300">Memory</span>
                </div>
                <span className={`text-sm font-bold ${
                  getUsageColor(stats.memory) === 'red' ? 'text-red-400' :
                  getUsageColor(stats.memory) === 'yellow' ? 'text-yellow-400' :
                  'text-purple-400'
                }`}>
                  {stats.memory}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    stats.memory > 90 
                      ? 'bg-gradient-to-r from-red-500 to-orange-600'
                      : stats.memory > 70
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-purple-500 to-pink-600'
                  }`}
                  style={{ width: `${Math.min(stats.memory, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* API Requests */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">API Requests</span>
                </div>
                <span className="text-sm font-bold text-yellow-400">{stats.requests}</span>
              </div>
            </div>

            {/* Uptime */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Uptime</span>
                </div>
                <span className="text-sm font-bold text-green-400">{stats.uptime}</span>
              </div>
            </div>
          </div>

          {/* Active Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Active Services</h4>
            
            {[
              { name: 'Gemini 1.5 Flash', status: 'online', color: 'green' },
              { name: 'Google Imagen 3', status: 'online', color: 'green' },
              { name: 'HuggingFace API', status: 'online', color: 'green' },
              { name: 'Sentinel Pro', status: 'monitoring', color: 'green' }
            ].map((service, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-sm text-gray-300">{service.name}</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${service.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                  <span className={`text-xs font-medium ${service.color === 'green' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Actions</h4>
            
            <button 
              onClick={fetchSystemHealth}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/50 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>{isLoading ? 'Refreshing...' : '🔄 Refresh Stats'}</span>
            </button>
            
            <button 
              onClick={handleCleanRAM}
              disabled={isCleaningRAM}
              className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/50 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isCleaningRAM ? 'Cleaning...' : '🧹 Clean RAM Cache'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-xs text-center text-gray-500">
            Auto-refresh: 3s • BG AI Tools v3.7
          </p>
        </div>
      </div>

      {/* Overlay when panel is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 animate-fadeIn"
        ></div>
      )}
    </>
  );
}
