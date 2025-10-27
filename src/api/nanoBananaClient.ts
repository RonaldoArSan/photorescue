// Simple mock client for gallery functionality
// Since photoRestoreAI works locally without a backend,
// this provides a simple interface for the gallery

import { PhotoRestoration } from '../types';

class NanoBananaClient {
  // Get restorations from localStorage
  async getRestorations(): Promise<PhotoRestoration[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem('photo_restorations');
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading restorations:', error);
      return [];
    }
  }

  // Save restoration to localStorage
  async saveRestoration(restoration: PhotoRestoration): Promise<PhotoRestoration> {
    if (typeof window === 'undefined') return restoration;
    
    try {
      const restorations = await this.getRestorations();
      const newRestoration = {
        ...restoration,
        id: restoration.id || `restoration-${Date.now()}`,
        created_date: restoration.created_date || new Date().toISOString(),
      };
      
      restorations.unshift(newRestoration);
      localStorage.setItem('photo_restorations', JSON.stringify(restorations));
      
      return newRestoration;
    } catch (error) {
      console.error('Error saving restoration:', error);
      throw error;
    }
  }

  // Delete restoration from localStorage
  async deleteRestoration(id: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const restorations = await this.getRestorations();
      const filtered = restorations.filter(r => r.id !== id);
      localStorage.setItem('photo_restorations', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting restoration:', error);
      throw error;
    }
  }

  // Upload file (mock implementation - just returns local blob URL)
  async uploadFile(file: File): Promise<{ file_url: string }> {
    return {
      file_url: URL.createObjectURL(file)
    };
  }

  // Restore photo (not used - we use photoRestoreAI directly)
  async restorePhoto(_imageUrl: string): Promise<{ restored_image_url: string }> {
    throw new Error('Use photoRestoreAI.restorePhoto instead');
  }
}

export const nanoBanana = new NanoBananaClient();
