import { photoRestoreAI } from './photoRestoreAI';
import { PhotoRestoration } from '../types';

interface UploadResponse {
  id: string;
  file_url: string;
  created_at: string;
}

interface RestoreResponse {
  restored_image_url: string;
  analysis?: string;
  suggestions?: string[];
}

class NanoBananaClient {
  private restorations: PhotoRestoration[] = [];
  private originalFiles = new Map<string, File>();

  // Verifica o status da configuração da IA
  getAIStatus() {
    return photoRestoreAI.getConfigurationStatus();
  }

  // Testa a conexão com a IA
  async testAI() {
    return await photoRestoreAI.testAIConnection();
  }

  async upload(file: File): Promise<UploadResponse> {
    try {
      console.log('📁 Processando upload...');
      
      // Cria uma URL local para exibição imediata
      const localUrl = URL.createObjectURL(file);
      
      // Armazena o arquivo original para uso na restauração
      this.originalFiles.set(localUrl, file);
      
      const photoId = Date.now().toString();
      return {
        id: photoId,
        file_url: localUrl,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      throw new Error('Falha no upload da imagem');
    }
  }

  async restorePhoto(imageUrl: string): Promise<RestoreResponse> {
    try {
      // Verifica o status da IA primeiro
      const aiStatus = this.getAIStatus();
      console.log('🔍 Status da IA:', aiStatus);
      
      if (aiStatus.configured) {
        console.log('🤖 Iniciando restauração com IA do Google Gemini...');
      } else {
        console.log('⚠️ IA não configurada. Usando restauração automática avançada...');
      }
      
      // Recupera o arquivo original armazenado
      const originalFile = this.originalFiles.get(imageUrl);
      
      if (!originalFile) {
        throw new Error('Arquivo original não encontrado');
      }

      // Usa a IA real para restauração
      const result = await photoRestoreAI.restorePhoto(originalFile);
      
      console.log('✅ Restauração concluída com sucesso!');
      console.log('📊 Resultado da restauração:', {
        hasAnalysis: !!result.analysis,
        analysisLength: result.analysis?.length || 0,
        suggestionsCount: result.suggestions?.length || 0,
        suggestions: result.suggestions
      });
      
      return result;
    } catch (error) {
      console.error('❌ Erro na restauração:', error);
      throw new Error('Falha na restauração da imagem');
    }
  }

  async saveRestoration(data: PhotoRestoration): Promise<PhotoRestoration> {
    try {
      console.log('💾 Salvando restauração...');
      
      const restoration: PhotoRestoration = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        created_date: new Date().toISOString(),
        status: 'completed'
      };
      
      this.restorations.push(restoration);
      
      console.log('✅ Restauração salva com sucesso!');
      return restoration;
    } catch (error) {
      console.error('❌ Erro ao salvar restauração:', error);
      throw new Error('Falha ao salvar a restauração');
    }
  }

  async getRestorations(): Promise<PhotoRestoration[]> {
    try {
      console.log('📋 Carregando histórico de restaurações...');
      return [...this.restorations];
    } catch (error) {
      console.error('❌ Erro ao carregar restaurações:', error);
      throw new Error('Falha ao carregar histórico de restaurações');
    }
  }
}

export const nanoBanana = new NanoBananaClient();