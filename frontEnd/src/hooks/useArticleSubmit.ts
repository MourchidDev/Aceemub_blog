import { useState } from 'react';
import apiClient from '../api/client';
import { Article, ArticlePayload } from '../types';

interface UseArticleSubmitReturn {
  submitArticle: (data: ArticlePayload & { id?: string }, isUpdate?: boolean) => Promise<Article>;
  loading: boolean;
  error: string | null;
}

const useArticleSubmit = (): UseArticleSubmitReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitArticle = async (data: ArticlePayload & { id?: string }, isUpdate = false): Promise<Article> => {
    setLoading(true);
    setError(null);

    const url = isUpdate ? `/articles/${data.id}` : '/articles';
    const method = isUpdate ? 'put' : 'post';

    try {
      const response = await apiClient[method]<Article>(url, data);
      return response.data;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message ?? "Une erreur est survenue";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitArticle, loading, error };
};

export default useArticleSubmit;
