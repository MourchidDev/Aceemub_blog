import { useState } from 'react';
import { Article, ArticlePayload } from '../types';
import { useUpdateArticle } from './useArticles';
import apiClient from '../api/client';

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

    try {
      let payload: any;
      let config: any = {};
      let url = '/articles';

      if (data instanceof FormData) {
        const hasFile = data.get('coverImage') instanceof File;
        
        if (hasFile) {
          payload = data;
          config.headers = { 'Content-Type': 'multipart/form-data' };
        } else {
          payload = {
            title: data.get('title'),
            slug: data.get('slug'),
            content: data.get('content'),
            status: data.get('status'),
            categoryId: data.get('categoryId'),
          };
        }
        
        if (isUpdate) {
          const formDataId = data.get('id');
          if (formDataId) url = `/articles/${formDataId}`;
        }
      } else {
        payload = data;
        url = isUpdate && data.id ? `/articles/${data.id}` : '/articles';
      }

      const method = isUpdate ? 'put' : 'post';
      const response = await apiClient[method]<Article>(url, payload, config);
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
