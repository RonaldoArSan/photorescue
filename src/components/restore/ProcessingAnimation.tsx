import { Loader2, Sparkles } from 'lucide-react';

export default function ProcessingAnimation() {
  return (
    <div className="clay-card bg-linear-to-br from-purple-100 to-pink-100 rounded-3xl p-16 text-center">
      <div className="relative">
        <div className="clay-button bg-white/90 w-32 h-32 rounded-3xl mx-auto mb-8 flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
        </div>
        <div className="absolute top-8 right-1/4">
          <Sparkles className="w-4 h-4 text-purple-500 animate-pulse delay-100" />
        </div>
        <div className="absolute top-12 left-1/4">
          <Sparkles className="w-5 h-5 text-blue-500 animate-pulse delay-200" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        Restaurando sua foto...
      </h3>
      
      <p className="text-gray-600 max-w-md mx-auto">
        Nossa IA está trabalhando para remover imperfeições, melhorar a qualidade e restaurar detalhes perdidos. Isso pode levar alguns instantes.
      </p>

      <div className="mt-8 clay-inset bg-white/60 rounded-2xl p-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Processando</span>
          <span className="text-sm font-bold text-purple-600">Em andamento</span>
        </div>
        <div className="h-2 clay-inset rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" style={{ width: '75%' }} />
        </div>
      </div>
    </div>
  );
}