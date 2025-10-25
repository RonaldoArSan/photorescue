export interface PhotoRestoration {
  id?: string;
  original_url: string;
  restored_url?: string;
  status?: 'processing' | 'completed' | 'failed';
  original_filename?: string;
  processing_time?: number;
  created_date?: string;
  analysis?: string;
  suggestions?: string[];
}