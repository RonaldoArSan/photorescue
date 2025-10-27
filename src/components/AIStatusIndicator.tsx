"use client"

import React, { useState, useEffect } from 'react';
import { photoRestoreAI } from '../api/photoRestoreAI';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AIStatus {
  configured: boolean;
  message: string;
  connectionTested?: boolean;
  connectionSuccess?: boolean;
  testMessage?: string;
}

const AIStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<AIStatus>({ configured: false, message: 'Verificando...' });
  const [isTesting, setIsTesting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Garante que está no lado do cliente
    setIsClient(true);
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    // Só executa no lado do cliente
    if (typeof window === 'undefined') return;
    
    try {
      const statusResult = await photoRestoreAI.getConfigurationStatus();
      console.log('🔍 Status da IA (cliente):', statusResult);
      setStatus(prev => ({ ...prev, ...statusResult }));
      
      // Se configurado, teste a conexão
      if (statusResult.configured) {
        setIsTesting(true);
        try {
          const testResult = await photoRestoreAI.testAIConnection();
          console.log('🧪 Teste de conexão:', testResult);
          setStatus(prev => ({ 
            ...prev, 
            connectionTested: true,
            connectionSuccess: testResult.success,
            testMessage: testResult.message 
          }));
        } catch (error) {
          console.error('❌ Erro no teste de conexão:', error);
          setStatus(prev => ({ 
            ...prev, 
            connectionTested: true,
            connectionSuccess: false,
            testMessage: 'Erro ao testar conexão com IA' 
          }));
        } finally {
          setIsTesting(false);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar status da IA:', error);
      setStatus({
        configured: false,
        message: 'Erro ao verificar status da IA'
      });
    }
  };

  // Não renderiza no servidor
  if (!isClient) {
    return (
      <div className="clay-card border-gray-200 bg-gray-50 border-2 rounded-2xl p-4 max-w-md mx-auto mb-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          <div className="flex-1">
            <p className="font-medium text-gray-600 text-sm">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    if (isTesting) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
    }
    
    if (!status.configured) {
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
    
    if (status.connectionTested) {
      return status.connectionSuccess 
        ? <CheckCircle className="w-4 h-4 text-green-600" />
        : <AlertCircle className="w-4 h-4 text-red-600" />;
    }
    
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  const getStatusColor = () => {
    if (isTesting) return 'border-blue-200 bg-blue-50';
    if (!status.configured) return 'border-yellow-200 bg-yellow-50';
    if (status.connectionTested) {
      return status.connectionSuccess 
        ? 'border-green-200 bg-green-50'
        : 'border-red-200 bg-red-50';
    }
    return 'border-green-200 bg-green-50';
  };

  const getStatusText = () => {
    if (isTesting) return 'Testando conexão com IA...';
    if (!status.configured) return 'IA não configurada';
    if (status.connectionTested) {
      return status.connectionSuccess ? 'IA funcionando' : 'Erro na IA';
    }
    return 'IA configurada';
  };

  const getDetailText = () => {
    if (status.connectionTested && status.testMessage) {
      return status.testMessage;
    }
    return status.message;
  };

  return (
    <div className={`clay-card ${getStatusColor()} border-2 rounded-2xl p-4 max-w-md mx-auto mb-6`}>
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div className="flex-1">
          <p className="font-medium text-gray-800 text-sm">
            {getStatusText()}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {getDetailText()}
          </p>
        </div>
        {status.configured && (
          <button
            onClick={checkAIStatus}
            disabled={isTesting}
            className="clay-button bg-white/60 hover:bg-white/80 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
          >
            {isTesting ? 'Testando...' : 'Testar'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AIStatusIndicator;