"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GalleryClient from './GalleryClient';

// Create a client instance for this component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function GalleryWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <GalleryClient />
    </QueryClientProvider>
  );
}