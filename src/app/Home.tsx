"use client"

import React, { useState } from 'react';
import { nanoBanana } from '../api/nanoBananaClient';
import { Download, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UploadZone from '../components/upload/UploadZone';
import ProcessingAnimation from '../components/restore/ProcessingAnimation';
import BeforeAfterSlider from '../components/restore/BeforeAfterSlider';

interface HomeState {
  uploadedFile: File | null;
  originalUrl: string | null;
  restoredUrl: string | null;
  isProcessing: boolean;
  error: string | null;
  processingTime: number | null;
}

export default function Home() {
  const [state, setState] = useState<HomeState>({
    uploadedFile: null,
    originalUrl: null,
    restoredUrl: null,
    isProcessing: false,
    error: null,
    processingTime: null
  });

  const handleFileSelect = async (file: File) => {
    setState(prev => ({ ...prev, error: null, restoredUrl: null, uploadedFile: file }));

    try {
      const { file_url } = await nanoBanana.upload(file);
      setState(prev => ({ ...prev, originalUrl: file_url }));
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error 
        ? `Erro no upload: ${err.message}` 
        : 'Erro ao fazer upload. Verifique sua conexão e tente novamente.';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  };

  const handleRestore = async () => {
    if (!state.originalUrl) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    const startTime = Date.now();

    try {
      const result = await nanoBanana.restorePhoto(state.originalUrl);
      const timeInSeconds = (Date.now() - startTime) / 1000;

      if (result.restored_image_url) {
        setState(prev => ({ 
          ...prev, 
          restoredUrl: result.restored_image_url, 
          processingTime: timeInSeconds 
        }));

        await nanoBanana.saveRestoration({
          original_url: state.originalUrl,
          restored_url: result.restored_image_url,
          status: 'completed',
          original_filename: state.uploadedFile?.name,
          processing_time: timeInSeconds
        });
      } else {
        throw new Error('Não foi possível restaurar a imagem');
      }
    } catch (err) {
      console.error('Restoration error:', err);
      const errorMessage = err instanceof Error 
        ? `Erro na restauração: ${err.message}` 
        : 'Erro ao restaurar a foto. Verifique sua conexão e tente novamente.';
      setState(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handleDownload = async () => {
    if (!state.restoredUrl) return;

    try {
      const response = await fetch(state.restoredUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `restored-${state.uploadedFile?.name || 'photo.jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar:', error);
    }
  };

  const handleReset = () => {
    setState({
      uploadedFile: null,
      originalUrl: null,
      restoredUrl: null,
      isProcessing: false,
      error: null,
      processingTime: null
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
         {!state.originalUrl && !state.isProcessing && !state.restoredUrl && (
        <div className="text-center mb-12">
          <div className="clay-button bg-linear-to-r from-red-400 to-yellow-400 w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center float-animation">
            <Sparkles className="w-10 h-10 text-purple-700" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Restaure Suas Memórias
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforme fotos antigas e danificadas em imagens nítidas e vibrantes usando o poder da Inteligência Artificial
          </p>
        </div>
      )}

      {state.error && (
        <div className="clay-card bg-red-50 border-4 border-red-200 rounded-3xl p-6 mb-8 max-w-2xl mx-auto">
          <p className="text-red-700 font-medium text-center">{state.error}</p>
        </div>
      )}

      {!state.originalUrl && !state.isProcessing && !state.restoredUrl && (
        <div className="max-w-3xl mx-auto">
          <UploadZone onFileSelect={handleFileSelect} isProcessing={false} />
          
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { title: 'Upload Rápido', desc: 'Envie sua foto em segundos' },
              { title: 'IA Avançada', desc: 'Restauração profissional automática' },
              { title: 'Download Grátis', desc: 'Baixe em alta qualidade' }
            ].map((feature, i) => (
              <div key={i} className="clay-card bg-white/70 rounded-3xl p-6 text-center">
                <div className="clay-button bg-linear-to-br from-blue-200 to-teal-200 w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {state.originalUrl && !state.isProcessing && !state.restoredUrl && (
        <div className="max-w-4xl mx-auto">
          <div className="clay-card bg-white/70 rounded-3xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Prévia da Sua Foto
            </h2>
            
            <div className="clay-inset rounded-3xl overflow-hidden mb-6">
              <img
                src={state.originalUrl}
                alt="Foto original"
                className="w-full h-auto object-contain max-h-96"
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleReset}
                variant="outline"
                className="clay-button bg-white/80 px-8 py-6 rounded-2xl text-lg font-bold hover:bg-white"
              >
                Escolher Outra Foto
              </Button>
              
              <Button
                onClick={handleRestore}
                className="clay-button bg-linear-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 px-8 py-6 rounded-2xl text-lg font-bold text-white shadow-xl"
              >
                <Sparkles className="w-6 h-6 inline mr-2" />
                Restaurar Agora
                <ArrowRight className="w-6 h-6 inline ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {state.isProcessing && (
        <div className="max-w-3xl mx-auto">
          <ProcessingAnimation />
        </div>
      )}

      {state.restoredUrl && state.originalUrl && (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="clay-button bg-linear-to-br from-green-200 to-teal-200 w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-700" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Restauração Completa!
            </h2>
            <p className="text-lg text-gray-600">
              Sua foto foi restaurada com sucesso
              {state.processingTime && ` em ${state.processingTime.toFixed(1)} segundos`}
            </p>
          </div>

          <BeforeAfterSlider
            beforeImage={state.originalUrl}
            afterImage={state.restoredUrl}
          />

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              onClick={handleReset}
              variant="outline"
              className="clay-button bg-white/80 px-8 py-6 rounded-2xl text-lg font-bold hover:bg-white"
            >
              Restaurar Outra Foto
            </Button>
            
            <Button
              onClick={handleDownload}
              className="clay-button bg-linear-to-br from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 px-8 py-6 rounded-2xl text-lg font-bold text-white shadow-xl"
            >
              <Download className="w-6 h-6 inline mr-2" />
              Baixar Foto Restaurada
            </Button>
          </div>
        </div>
      )}
       </div>
  )
}