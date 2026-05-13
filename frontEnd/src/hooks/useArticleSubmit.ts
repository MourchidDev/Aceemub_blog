import { useState } from 'react';
import apiClient from '../api/client';
import { Article, ArticlePayload } from '../types';

interface UseArticleSubmitReturn {
  submitArticle: (data: FormData | (ArticlePayload & { id?: string }), isUpdate?: boolean) => Promise<Article>;
  loading: boolean;
  error: string | null;
}

const useArticleSubmit = (): UseArticleSubmitReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const submitArticle = async (data: FormData | (ArticlePayload & { id?: string }), isUpdate = false): Promise<Article> => {
    setLoading(true);
    setError(null);
    console.log('voici la réponse:', data);

    try {
      let payload: any = data;
      const config: any = {};
      let url = '/articles';

      // Si c'est FormData, l'utiliser directement
      if (data instanceof FormData) {
        payload = data;
        config.headers = { 'Content-Type': 'multipart/form-data' };
        
        // Extraire l'ID de FormData pour la mise à jour
        if (isUpdate) {
          const formDataId = (data as any).get?.('id');
          if (formDataId) {
            url = `/articles/${formDataId}`;
          }
        }
      } else {
        // Si c'est un objet JSON standard
        url = isUpdate && data.id ? `/articles/${data.id}` : '/articles';
      }

      const method = isUpdate ? 'put' : 'post';
      const response = await apiClient[method]<Article>(url, payload, config);
      console.log('voici la réponse:', response);
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Une erreur est survenue';
      setError(typeof errorMessage === 'string' ? errorMessage : 'Erreur inconnue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitArticle, loading, error };
};

export default useArticleSubmit;