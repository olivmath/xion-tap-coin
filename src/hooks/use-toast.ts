import { useState, useCallback } from 'react';

interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

/**
 * Hook simples para toast usando sonner
 * Compatível com a interface esperada pelos componentes
 */
export const useToast = () => {
  const toast = useCallback((props: ToastProps) => {
    // Importação dinâmica do sonner para evitar problemas de SSR
    import('sonner').then(({ toast: sonnerToast }) => {
      if (props.variant === 'destructive') {
        sonnerToast.error(props.title, {
          description: props.description,
        });
      } else {
        sonnerToast.success(props.title, {
          description: props.description,
        });
      }
    });
  }, []);

  return { toast };
};

// Export direto para compatibilidade
export const toast = (props: ToastProps) => {
  import('sonner').then(({ toast: sonnerToast }) => {
    if (props.variant === 'destructive') {
      sonnerToast.error(props.title, {
        description: props.description,
      });
    } else {
      sonnerToast.success(props.title, {
        description: props.description,
      });
    }
  });
};