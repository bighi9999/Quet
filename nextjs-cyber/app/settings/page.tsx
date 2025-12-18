'use client';

import { useEffect, useState } from 'react';
import { 
  AI_PROVIDERS, 
  getApiKey, 
  saveApiKey, 
  removeApiKey,
  hasApiKey,
  type AIProvider 
} from '@/lib/ai-config';
import { 
  Shield, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Save,
  Trash2,
  RefreshCw,
  Zap
} from 'lucide-react';

interface ProviderKeyState {
  providerId: string;
  apiKey: string;
  isVisible: boolean;
  hasKey: boolean;
  isSaving: boolean;
}

export default function SettingsPage() {
  const [providerStates, setProviderStates] = useState<ProviderKeyState[]>([]);
  const [mounted, setMounted] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Initialize state from localStorage
  useEffect(() => {
    setMounted(true);
    
    const initialStates: ProviderKeyState[] = AI_PROVIDERS.map(provider => ({
      providerId: provider.id,
      apiKey: getApiKey(provider.id) || '',
      isVisible: false,
      hasKey: hasApiKey(provider.id),
      isSaving: false
    }));
    
    setProviderStates(initialStates);
  }, []);

  const updateProviderState = (providerId: string, updates: Partial<ProviderKeyState>) => {
    setProviderStates(prev => 
      prev.map(state => 
        state.providerId === providerId 
          ? { ...state, ...updates }
          : state
      )
    );
  };

  const handleKeyChange = (providerId: string, value: string) => {
    updateProviderState(providerId, { apiKey: value });
  };

  const toggleVisibility = (providerId: string) => {
    setProviderStates(prev => 
      prev.map(state => 
        state.providerId === providerId 
          ? { ...state, isVisible: !state.isVisible }
          : state
      )
    );
  };

  const handleSaveKey = (providerId: string) => {
    const state = providerStates.find(s => s.providerId === providerId);
    if (!state) return;

    updateProviderState(providerId, { isSaving: true });

    // Simulate API key validation (you can add real validation here)
    setTimeout(() => {
      if (state.apiKey.trim()) {
        saveApiKey(providerId, state.apiKey);
        updateProviderState(providerId, { 
          isSaving: false, 
          hasKey: true 
        });
        setSaveSuccess(providerId);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(null), 3000);
      } else {
        updateProviderState(providerId, { isSaving: false });
      }
    }, 500);
  };

  const handleRemoveKey = (providerId: string) => {
    if (confirm('Bạn có chắc muốn xóa API Key này?')) {
      removeApiKey(providerId);
      updateProviderState(providerId, { 
        apiKey: '', 
        hasKey: false 
      });
    }
  };

  const handleSaveAll = () => {
    providerStates.forEach(state => {
      if (state.apiKey.trim()) {
        saveApiKey(state.providerId, state.apiKey);
      }
    });
    
    // Refresh hasKey status for all providers
    const updatedStates = providerStates.map(state => ({
      ...state,
      hasKey: hasApiKey(state.providerId)
    }));
    setProviderStates(updatedStates);
    
    setSaveSuccess('all');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                AI Model Registry
              </h1>
              <p className="text-gray-400 mt-1">
                Quản lý API Keys cho nhiều nhà cung cấp AI
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <p className="font-semibold text-white mb-1">🔒 Bảo mật thông tin</p>
              <p>
                API Keys được lưu trữ cục bộ trong <code className="px-1.5 py-0.5 bg-black/50 rounded text-cyan-400">localStorage</code> của trình duyệt. 
                Không ai có thể truy cập ngoài máy tính của bạn. 
                Keys sẽ được gửi trực tiếp đến các nhà cung cấp AI mà không qua server trung gian.
              </p>
            </div>
          </div>
        </div>

        {/* Provider Cards */}
        <div className="space-y-6">
          {AI_PROVIDERS.map((provider) => {
            const state = providerStates.find(s => s.providerId === provider.id);
            if (!state) return null;

            return (
              <div
                key={provider.id}
                className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 group"
              >
                {/* Provider Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="text-4xl p-3 rounded-xl"
                      style={{ 
                        backgroundColor: `${provider.color}15`,
                        boxShadow: `0 0 20px ${provider.color}30`
                      }}
                    >
                      {provider.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {provider.name}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {provider.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {provider.models.length} models available
                        </span>
                        {state.hasKey && (
                          <>
                            <span className="text-gray-500">•</span>
                            <span className="text-xs text-green-400 flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Đã kết nối</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {state.hasKey ? (
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">Đã cấu hình</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Chưa có Key</span>
                    </div>
                  )}
                </div>

                {/* Models List */}
                <div className="mb-4 bg-black/30 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-2 flex items-center space-x-2">
                    <Zap className="w-3 h-3" />
                    <span>Available Models:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {provider.models.map((model) => (
                      <div
                        key={model.id}
                        className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-lg"
                      >
                        <div className="text-xs font-medium text-white">
                          {model.name}
                        </div>
                        {model.description && (
                          <div className="text-xs text-gray-400">
                            {model.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Key Input */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                    <Key className="w-4 h-4 text-cyan-400" />
                    <span>API Key</span>
                  </label>
                  
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input
                        type={state.isVisible ? 'text' : 'password'}
                        value={state.apiKey}
                        onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                        placeholder={provider.placeholder}
                        className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none font-mono text-sm"
                      />
                      
                      {/* Visibility Toggle */}
                      <button
                        onClick={() => toggleVisibility(provider.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded transition-colors"
                      >
                        {state.isVisible ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <button
                      onClick={() => handleSaveKey(provider.id)}
                      disabled={!state.apiKey.trim() || state.isSaving}
                      className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {state.isSaving ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Lưu</span>
                    </button>

                    {state.hasKey && (
                      <button
                        onClick={() => handleRemoveKey(provider.id)}
                        className="px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-all flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Xóa</span>
                      </button>
                    )}
                  </div>

                  {/* Success Message */}
                  {saveSuccess === provider.id && (
                    <div className="flex items-center space-x-2 text-sm text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>✅ Đã lưu API Key thành công!</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save All Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSaveAll}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-lg font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 flex items-center space-x-3"
          >
            <Save className="w-6 h-6" />
            <span>💾 LƯU TẤT CẢ CẤU HÌNH</span>
          </button>
        </div>

        {/* Success Banner for Save All */}
        {saveSuccess === 'all' && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center space-x-3 animate-slideDown">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <span className="text-green-400 font-semibold text-lg">
              ✅ Đã lưu toàn bộ cấu hình thành công!
            </span>
          </div>
        )}

        {/* How to Get API Keys */}
        <div className="mt-12 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Key className="w-6 h-6 text-cyan-400" />
            <span>📖 Hướng dẫn lấy API Key</span>
          </h3>
          
          <div className="space-y-4 text-sm text-gray-300">
            {AI_PROVIDERS.map((provider) => (
              <div key={provider.id} className="flex items-start space-x-3">
                <div className="text-2xl">{provider.icon}</div>
                <div>
                  <p className="font-semibold text-white mb-1">{provider.name}</p>
                  <p className="text-gray-400">
                    {provider.id === 'google' && (
                      <>Truy cập: <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-cyan-400 hover:underline">Google AI Studio</a> → Tạo API Key mới</>
                    )}
                    {provider.id === 'openai' && (
                      <>Truy cập: <a href="https://platform.openai.com/api-keys" target="_blank" className="text-cyan-400 hover:underline">OpenAI Platform</a> → API Keys → Create new key</>
                    )}
                    {provider.id === 'anthropic' && (
                      <>Truy cập: <a href="https://console.anthropic.com/settings/keys" target="_blank" className="text-cyan-400 hover:underline">Anthropic Console</a> → API Keys → Create key</>
                    )}
                    {provider.id === 'groq' && (
                      <>Truy cập: <a href="https://console.groq.com/keys" target="_blank" className="text-cyan-400 hover:underline">Groq Console</a> → API Keys → Create API Key</>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
