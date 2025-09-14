import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

export interface UploadOptions {
  organizationId: number;
  uploadType: 'metrics' | 'parameters';
  module?: string;
}

export function useDataUpload() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, options }: { file: File; options: UploadOptions }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('organizationId', options.organizationId.toString());
      formData.append('uploadType', options.uploadType);
      if (options.module) {
        formData.append('module', options.module);
      }

      const response = await fetch('/api/data/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Upload Successful',
        description: `${data.success} records processed successfully`,
      });

      // Invalidate relevant queries based on upload type
      const { organizationId, uploadType } = variables.options;
      
      if (uploadType === 'metrics') {
        queryClient.invalidateQueries({ 
          queryKey: [`/api/esg-metrics/${organizationId}`] 
        });
        queryClient.invalidateQueries({ 
          queryKey: [`/api/environmental-metrics/${organizationId}`] 
        });
        queryClient.invalidateQueries({ 
          queryKey: [`/api/social-metrics/${organizationId}`] 
        });
      } else {
        queryClient.invalidateQueries({ 
          queryKey: [`/api/esg-parameters/${organizationId}`] 
        });
      }

      // Invalidate ESG scores as they may be affected
      queryClient.invalidateQueries({ 
        queryKey: [`/api/esg-scores/${organizationId}`] 
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useTemplateDownload() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (templateType: 'metrics' | 'parameters') => {
      const response = await fetch(`/api/data/template/${templateType}`);
      
      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ESG_${templateType}_Template.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({
        title: 'Template Downloaded',
        description: 'Excel template has been downloaded to your device',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Download Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useIntegrationSync() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ organizationId, integrations }: { organizationId: number; integrations: any[] }) => {
      const response = await fetch(`/api/data/sync/${organizationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ integrations }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sync failed');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      const successCount = data.results.filter((r: any) => r.status === 'success').length;
      const errorCount = data.results.filter((r: any) => r.status === 'error').length;
      
      toast({
        title: 'Integration Sync Complete',
        description: `${successCount} integrations synced successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        variant: errorCount > 0 ? 'destructive' : 'default',
      });

      // Invalidate all data queries
      queryClient.invalidateQueries({ 
        queryKey: [`/api/esg-metrics/${variables.organizationId}`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/esg-parameters/${variables.organizationId}`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/esg-scores/${variables.organizationId}`] 
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Sync Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}