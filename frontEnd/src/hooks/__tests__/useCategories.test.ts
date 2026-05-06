import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../useCategories';
import * as api from '../../api/categories';

vi.mock('../../api/categories');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all categories', async () => {
    const mockCategories = [
      { id: '1', name: 'Tech', slug: 'tech' },
      { id: '2', name: 'Science', slug: 'science' },
    ];
    vi.mocked(api.categoriesApi.getAll).mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCategories);
  });

  it('should handle fetch error', async () => {
    vi.mocked(api.categoriesApi.getAll).mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useCreateCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a category', async () => {
    const newCategory = { name: 'Tech', slug: 'tech' };
    const createdCategory = { id: '1', ...newCategory };
    vi.mocked(api.categoriesApi.create).mockResolvedValue(createdCategory);

    const { result } = renderHook(() => useCreateCategory(), { wrapper: createWrapper() });

    result.current.mutate(newCategory);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(createdCategory);
  });
});

describe('useUpdateCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update a category', async () => {
    const updatedCategory = { id: '1', name: 'Technology', slug: 'tech' };
    vi.mocked(api.categoriesApi.update).mockResolvedValue(updatedCategory);

    const { result } = renderHook(() => useUpdateCategory(), { wrapper: createWrapper() });

    result.current.mutate({ id: '1', name: 'Technology' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(updatedCategory);
  });
});

describe('useDeleteCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a category', async () => {
    vi.mocked(api.categoriesApi.delete).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteCategory(), { wrapper: createWrapper() });

    result.current.mutate('1');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
