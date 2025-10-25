import React from 'react';
import { Brain, CheckCircle, Info } from 'lucide-react';

interface AIAnalysisCardProps {
  analysis?: string;
  suggestions?: string[];
}

export default function AIAnalysisCard({ analysis, suggestions }: AIAnalysisCardProps) {
  if (!analysis && (!suggestions || suggestions.length === 0)) {
    return null;
  }

  return (
    <div className="clay-card bg-linear-to-br from-blue-50 to-indigo-100 rounded-3xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="clay-button bg-blue-200 p-3 rounded-2xl">
          <Brain className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-800">Análise da IA</h3>
          <p className="text-sm text-blue-600">Insights sobre sua foto</p>
        </div>
      </div>

      {analysis && (
        <div className="clay-inset bg-white/60 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-blue-800 text-sm leading-relaxed">
              {analysis}
            </p>
          </div>
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="clay-inset bg-white/60 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-blue-800">
              Melhorias Aplicadas
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <span
                key={index}
                className="clay-button bg-linear-to-r from-green-100 to-emerald-100 px-3 py-2 rounded-xl text-sm text-green-800 font-medium"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}