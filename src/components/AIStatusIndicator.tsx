"use client"

import React, { useState, useEffect } from 'react';
import { nanoBanana } from '../api/nanoBananaClient';
import { CheckCircle, AlertTriangle, Bot } from 'lucide-react';

export default function AIStatusIndicator() {
  const [status, setStatus] = useState<{ configured: boolean; message: string } | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAIStatus = async () => {
      try {
        // Verifica o status da configuração
        const aiStatus = nanoBanana.getAIStatus();
        setStatus(aiStatus);

        // Se estiver configurado, testa a conexão
        if (aiStatus.configured) {
          const testResult = await nanoBanana.testAI();
          setTestResult(testResult);
        }
      } catch (error) {
        console.error('Erro ao verificar status da IA:', error);
        setStatus({
          configured: false,
          message: 'Erro ao verificar configuração da IA'
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAIStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="clay-card bg-blue-50/70 border-2 border-blue-200 rounded-2xl p-4 mb-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="animate-spin">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm text-blue-700">Verificando configuração da IA...</span>
        </div>
      </div>
    );
  }

  if (!status) return null;

  const isFullyWorking = status.configured && testResult?.success;
  const hasIssue = status.configured && testResult && !testResult.success;

  return (
    <div className={`clay-card border-2 rounded-2xl p-4 mb-6 max-w-4xl mx-auto ${
      isFullyWorking 
        ? 'bg-green-50/70 border-green-200' 
        : hasIssue 
        ? 'bg-yellow-50/70 border-yellow-200'
        : 'bg-orange-50/70 border-orange-200'
    }`}>
      <div className="flex items-center gap-3">
        {isFullyWorking ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        )}
        
        <div className="flex-1">
          <div className={`text-sm font-medium ${
            isFullyWorking ? 'text-green-700' : 'text-orange-700'
          }`}>
            {isFullyWorking 
              ? '🤖 IA Google Gemini Ativa' 
              : hasIssue 
              ? '⚠️ IA Configurada com Problemas'
              : '⚠️ IA em Modo Automático'
            }
          </div>
          
          <div className={`text-xs mt-1 ${
            isFullyWorking ? 'text-green-600' : 'text-orange-600'
          }`}>
            {isFullyWorking 
              ? 'Análise personalizada e restauração profissional disponíveis'
              : hasIssue 
              ? `Problema: ${testResult?.message}. Usando modo automático.`
              : 'Configure GOOGLE_GEMINI_API_KEY para análise personalizada'
            }
          </div>
        </div>
      </div>
    </div>
  );
}