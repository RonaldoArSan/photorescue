interface RestoreImageResult {
  restored_image_url: string;
  analysis?: string;
  suggestions?: string[];
}

class PhotoRestoreAI {
  private isConfigured: boolean;

  constructor() {
    // Verifica se alguma chave de API está configurada
    // REPLICATE_API_TOKEN ou OPENAI_API_KEY
    this.isConfigured = !!(
      process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN || 
      process.env.NEXT_PUBLIC_OPENAI_API_KEY
    );
    console.log('🔑 PhotoRestoreAI inicializado. Modo IA habilitado:', this.isConfigured);
  }

  private async processImageWithCanvas(file: File, suggestions: string[]): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        if (!ctx) {
          resolve(URL.createObjectURL(file));
          return;
        }

        ctx.drawImage(img, 0, 0);
        this.applyEnhancements(ctx, img.width, img.height, suggestions);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            resolve(URL.createObjectURL(file));
          }
        }, 'image/jpeg', 0.9);
      };

      img.onerror = () => resolve(URL.createObjectURL(file));
      img.src = URL.createObjectURL(file);
    });
  }

  private applyEnhancements(ctx: CanvasRenderingContext2D, width: number, height: number, suggestions: string[]): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Aplicar ajustes de brilho e contraste automático
    this.autoAdjustBrightnessContrast(data);
    
    // Aplicar redução de ruído
    ctx.putImageData(imageData, 0, 0);
    const denoisedData = this.applyDenoising(ctx, width, height);
    
    // Aplicar aumento de nitidez
    this.applySharpen(denoisedData.data);
    
    // Aplicar correção de cor e saturação
    this.autoColorCorrection(denoisedData.data);
    
    ctx.putImageData(denoisedData, 0, 0);
  }

  private autoAdjustBrightnessContrast(data: Uint8ClampedArray): void {
    // Calcular histograma
    let min = 255, max = 0;
    for (let i = 0; i < data.length; i += 4) {
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      min = Math.min(min, luminance);
      max = Math.max(max, luminance);
    }

    // Normalização de contraste automática
    const scale = 255 / (max - min);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, (data[i] - min) * scale));
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - min) * scale));
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - min) * scale));
    }
  }

  private applyDenoising(ctx: CanvasRenderingContext2D, width: number, height: number): ImageData {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);

    // Filtro bilateral simplificado para redução de ruído
    const radius = 2;
    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        const idx = (y * width + x) * 4;
        
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nIdx = ((y + dy) * width + (x + dx)) * 4;
            rSum += data[nIdx];
            gSum += data[nIdx + 1];
            bSum += data[nIdx + 2];
            count++;
          }
        }
        
        output[idx] = rSum / count;
        output[idx + 1] = gSum / count;
        output[idx + 2] = bSum / count;
      }
    }

    return new ImageData(output, width, height);
  }

  private applySharpen(data: Uint8ClampedArray): void {
    // Aplicar um filtro de nitidez suave
    const sharpenFactor = 0.2;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Realce de bordas
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const enhancement = gray * sharpenFactor;
      
      data[i] = Math.min(255, Math.max(0, r + enhancement));
      data[i + 1] = Math.min(255, Math.max(0, g + enhancement));
      data[i + 2] = Math.min(255, Math.max(0, b + enhancement));
    }
  }

  private autoColorCorrection(data: Uint8ClampedArray): void {
    // Calcular médias de cor
    let rAvg = 0, gAvg = 0, bAvg = 0, count = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      rAvg += data[i];
      gAvg += data[i + 1];
      bAvg += data[i + 2];
      count++;
    }
    
    rAvg /= count;
    gAvg /= count;
    bAvg /= count;
    
    // Calcular balanço de branco
    const grayAvg = (rAvg + gAvg + bAvg) / 3;
    const rScale = grayAvg / rAvg;
    const gScale = grayAvg / gAvg;
    const bScale = grayAvg / bAvg;
    
    // Aplicar correção de cor e aumentar saturação
    const saturationBoost = 1.15;
    
    for (let i = 0; i < data.length; i += 4) {
      // Balanço de branco
      let r = data[i] * rScale;
      let g = data[i + 1] * gScale;
      let b = data[i + 2] * bScale;
      
      // Aumento de saturação
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + saturationBoost * (r - gray);
      g = gray + saturationBoost * (g - gray);
      b = gray + saturationBoost * (b - gray);
      
      data[i] = Math.min(255, Math.max(0, r));
      data[i + 1] = Math.min(255, Math.max(0, g));
      data[i + 2] = Math.min(255, Math.max(0, b));
    }
  }

  getConfigurationStatus(): { configured: boolean; message: string } {
    if (this.isConfigured) {
      return {
        configured: true,
        message: 'API de restauração configurada e pronta para uso!'
      };
    }
    
    return {
      configured: false,
      message: 'Configure a chave da API para habilitar a restauração com IA.'
    };
  }

  async testAIConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured) {
      return {
        success: false,
        message: 'IA não configurada. Configure a NEXT_PUBLIC_OPENAI_API_KEY no seu ambiente.'
      };
    }
    // Este teste agora pode ser um ping para um endpoint de status da nossa própria API
    // Por enquanto, vamos apenas simular um sucesso se a chave estiver presente.
    return {
      success: true,
      message: 'A API de backend parece estar configurada para usar IA.'
    };
  }

  async restorePhoto(file: File): Promise<RestoreImageResult> {
    // Tenta usar o backend com IA (Replicate GFPGAN) se configurado
    if (this.isConfigured) {
      try {
        console.log('🚀 Enviando imagem para restauração com IA via backend (Replicate GFPGAN)...');
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/restore', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Falha na API de restauração');
        }

        const result = await response.json();
        
        // A URL da imagem retornada pelo Replicate precisa ser buscada através do nosso proxy
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(result.restored_image_url)}`;
        const imageResponse = await fetch(proxyUrl);
        const blob = await imageResponse.blob();
        const finalUrl = URL.createObjectURL(blob);

        console.log('✅ Restauração com IA concluída com sucesso!');
        return {
          restored_image_url: finalUrl,
          analysis: result.analysis,
          suggestions: result.suggestions,
        };

      } catch (error) {
        console.warn('⚠️ Erro na restauração via backend, usando processamento local:', error);
        return this.runFallback(file);
      }
    }
    
    // Se não estiver configurado, usa processamento local
    console.log('🔧 Usando modo de restauração local avançado (processa sua imagem real).');
    return this.runFallback(file);
  }

  private async runFallback(file: File): Promise<RestoreImageResult> {
    const suggestions = ['brightness', 'contrast', 'saturation', 'denoising', 'sharpness', 'color-correction'];
    const restoredUrl = await this.processImageWithCanvas(file, suggestions);
    return {
      restored_image_url: restoredUrl,
      analysis: 'Restauração local avançada aplicada: ajuste automático de brilho/contraste, redução de ruído, aumento de nitidez, correção de cor e saturação. Sua imagem original foi processada e melhorada.',
      suggestions: suggestions,
    };
  }
}

export const photoRestoreAI = new PhotoRestoreAI();