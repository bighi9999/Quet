'use client';

import { useState, useEffect } from 'react';
import { Bot, X, Cpu, HardDrive, Activity, Zap } from 'lucide-react';

interface SystemStats {
  cpu: number;
  memory: number;
  memoryTotal: number;
  requests: number;
  uptime: string;
  status: string;
}

export default function FloatingAIBot() {
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

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchSystemHealth();
    
    // Update every 5 seconds
    const interval = setInterval(() => {
      fetchSystemHealth();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Floating Bot Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full shadow-2xl shadow-cyan-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      >
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 animate-ping opacity-20"></div>
        
        {/* Bot Icon */}
        <Bot className="w-8 h-8 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Status Indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
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
              <h3 className="text-white font-bold">AI Assistant</h3>
              <p className="text-xs text-gray-400">System Monitor</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
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
                <p className="text-sm text-gray-400 font-medium">⏳ Loading system status...</p>
                <p className="text-xs text-gray-400 mt-1">Please wait</p>
              </>
            ) : (
              <>
                <p className={`text-sm font-medium ${
                  stats.status === 'CRITICAL' ? 'text-red-400'
                  : stats.status === 'WARNING' ? 'text-yellow-400'
                  : 'text-cyan-400'
                }`}>
                  {stats.status === 'CRITICAL' ? '🔴 Critical - High Usage'
                   : stats.status === 'WARNING' ? '⚠️ Warning - Elevated Usage'
                   : '✨ All systems operational'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {stats.memoryTotal > 0 ? `Total RAM: ${stats.memoryTotal.toFixed(1)}GB` : 'Google Cloud APIs ready'}
                </p>
              </>
            )}
          </div>

          {/* System Stats */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">System Status</h4>

            {/* CPU Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className={`w-4 h-4 ${stats.cpu > 80 ? 'text-red-400' : 'text-cyan-400'}`} />
                  <span className="text-sm text-gray-300">CPU Usage</span>
                </div>
                <span className={`text-sm font-bold ${stats.cpu > 80 ? 'text-red-400' : 'text-cyan-400'}`}>
                  {stats.cpu}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    stats.cpu > 80 
                      ? 'bg-gradient-to-r from-red-500 to-orange-600' 
                      : 'bg-gradient-to-r from-cyan-500 to-purple-600'
                  }`}
                  style={{ width: `${Math.min(stats.cpu, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HardDrive className={`w-4 h-4 ${stats.memory > 80 ? 'text-red-400' : 'text-purple-400'}`} />
                  <span className="text-sm text-gray-300">Memory</span>
                </div>
                <span className={`text-sm font-bold ${stats.memory > 80 ? 'text-red-400' : 'text-purple-400'}`}>
                  {stats.memory}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    stats.memory > 80 
                      ? 'bg-gradient-to-r from-red-500 to-orange-600' 
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
              { name: 'Google Cloud TTS', status: 'ready', color: 'yellow' }
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
            
            <button className="w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/50 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300">
              🔄 Refresh Stats
            </button>
            
            <button className="w-full bg-white/5 hover:bg-white/10 border border-gray-700 text-gray-300 text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300">
              📊 View Logs
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-xs text-center text-gray-500">
            BG AI Tools v3.4.1 • Google Cloud Edition
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
