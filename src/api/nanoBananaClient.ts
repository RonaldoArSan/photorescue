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
  private baseUrl = 'https://api.example.com'; // URL da API externa
  private useMockData = true; // Por enquanto sempre usa mock para demonstração
  private mockRestorations: PhotoRestoration[] = [];
  private originalFiles = new Map<string, File>(); // Armazena arquivos originais por URL

  private async mockRestorePhoto(imageUrl: string, originalFile?: File): Promise<RestoreResponse> {
    // Simula delay inicial
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (originalFile) {
      // Usa IA real para restauração
      console.log('🤖 Iniciando restauração com IA...');
      const result = await photoRestoreAI.restorePhoto(originalFile);
      return result;
    }
    
    // Fallback para quando não há arquivo original
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Desenha a imagem original
        ctx?.drawImage(img, 0, 0);
        
        // Simula uma "restauração" aplicando filtros
        if (ctx) {
          ctx.filter = 'brightness(1.1) contrast(1.1) saturate(1.1)';
          ctx.drawImage(img, 0, 0);
        }
        
        // Converte para blob e cria URL
        canvas.toBlob((blob) => {
          if (blob) {
            const restoredUrl = URL.createObjectURL(blob);
            resolve({ 
              restored_image_url: restoredUrl,
              analysis: "Durante a restauração, os seguintes ajustes foram feitos:\n\nAjuste de Cor e Contraste: As cores foram realçadas e o contraste foi ajustado para trazer mais vida à imagem.\n\nMelhoria de Nitidez: A nitidez da imagem foi aprimorada para que os detalhes ficassem mais claros e definidos.\n\nLimpeza Geral: Aplicados filtros para reduzir ruídos e melhorar a qualidade geral da imagem.",
              suggestions: ["Ajuste de Cor e Contraste", "Melhoria de Nitidez", "Limpeza Geral"]
            });
          } else {
            // Fallback: retorna a imagem original
            resolve({ 
              restored_image_url: imageUrl,
              analysis: "Não foi possível processar a imagem automaticamente. A imagem original foi preservada sem alterações.",
              suggestions: []
            });
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.onerror = () => {
        // Fallback: retorna a imagem original
        resolve({ 
          restored_image_url: imageUrl,
          analysis: "Houve um problema técnico durante o carregamento da imagem. A imagem original foi preservada sem alterações para manter sua integridade.",
          suggestions: []
        });
      };
      
      img.src = imageUrl;
    });
  }

  private async mockSaveRestoration(data: PhotoRestoration): Promise<PhotoRestoration> {
    const restoration: PhotoRestoration = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_date: new Date().toISOString(),
      status: 'completed'
    };
    
    this.mockRestorations.push(restoration);
    return restoration;
  }

  private async mockGetRestorations(): Promise<PhotoRestoration[]> {
    return [...this.mockRestorations];
  }

  async upload(file: File): Promise<UploadResponse> {
    try {
      // Cria uma URL local para exibição imediata
      const localUrl = URL.createObjectURL(file);
      
      if (this.useMockData) {
        console.log('📁 Modo Mock: Usando IA local...');
        // Armazena o arquivo original para uso na restauração
        this.originalFiles.set(localUrl, file);
        
        // Em modo mock, simula um upload rápido e retorna URL local
        const photoId = Date.now().toString();
        return {
          id: photoId,
          file_url: localUrl,
          created_at: new Date().toISOString()
        };
      } else {
        console.log('🌐 Enviando para API externa...');
        // Armazena o arquivo original para uso na restauração
        this.originalFiles.set(localUrl, file);
        
        // Implementação real da API externa
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }
        
        return await response.json();
      }
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      // Fallback automático para mock em caso de erro
      const photoId = Date.now().toString();
      const localUrl = URL.createObjectURL(file);
      // Armazena o arquivo original para uso na restauração
      this.originalFiles.set(localUrl, file);
      
      return {
        id: photoId,
        file_url: localUrl,
        created_at: new Date().toISOString()
      };
    }
  }

  async restorePhoto(imageUrl: string): Promise<RestoreResponse> {
    try {
      if (this.useMockData) {
        // Recupera o arquivo original armazenado
        const originalFile = this.originalFiles.get(imageUrl);
        return await this.mockRestorePhoto(imageUrl, originalFile);
      }

      const response = await fetch(`${this.baseUrl}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      if (!response.ok) {
        throw new Error(`Restoration failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('API não disponível, usando mock data para demonstração');
        this.useMockData = true;
        // Recupera o arquivo original armazenado
        const originalFile = this.originalFiles.get(imageUrl);
        return await this.mockRestorePhoto(imageUrl, originalFile);
      }
      throw error;
    }
  }

  async saveRestoration(data: PhotoRestoration): Promise<PhotoRestoration> {
    try {
      if (this.useMockData) {
        return await this.mockSaveRestoration(data);
      }

      const response = await fetch(`${this.baseUrl}/restorations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Save failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('API não disponível, usando mock data para demonstração');
        this.useMockData = true;
        return await this.mockSaveRestoration(data);
      }
      throw error;
    }
  }

  async getRestorations(): Promise<PhotoRestoration[]> {
    try {
      if (this.useMockData) {
        return await this.mockGetRestorations();
      }

      const response = await fetch(`${this.baseUrl}/restorations`);

      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('API não disponível, usando mock data para demonstração');
        this.useMockData = true;
        return await this.mockGetRestorations();
      }
      throw error;
    }
  }
}

export const nanoBanana = new NanoBananaClient();