import { api, apiRequest } from '@/lib/api/http';
import type { ApiResponse, ApiListResponse } from '@/lib/api/types';
import type { Product, ProductFilter, UpsertProductRequest } from '@/types/product';
import { allMockProducts, getMockProduct, addMockProduct } from '@/data/mock-data';

// TODO: Remove mock helpers once the real backend is available
const USE_MOCK = false;

// ---------------------------------------------------------------------------
// Normalizers: bridge backend field names → frontend Product type
// ---------------------------------------------------------------------------

/** Normalize a manage-endpoint product (ProductManageSummaryResponse / ProductManageUpdateResponse) */
function normalizeManageProduct(raw: any): Product {
  return {
    ...raw,
    imageUrl: raw.imageUrl ?? raw.thumbnailUrl ?? undefined,
    stock: raw.stock ?? raw.stockQuantity ?? 0,
    stockQuantity: raw.stockQuantity ?? raw.stock ?? 0,
  };
}

/** Normalize a store product detail (StoreProductDetailResponse) */
function normalizeStoreProductDetail(raw: any): Product {
  const mainImg = raw.mainImageUrl ?? raw.imageUrl ?? undefined;
  return {
    ...raw,
    imageUrl: mainImg,
    images: raw.images?.length ? raw.images : (mainImg ? [{ url: mainImg }] : []),
    colors: raw.colors ?? raw.colorOptions ?? [],
    sizes: raw.sizes ?? raw.sizeOptions ?? [],
    stock: raw.stock ?? raw.stockQuantity ?? 0,
    stockQuantity: raw.stockQuantity ?? raw.stock ?? 0,
    compareAtPrice: raw.compareAtPrice ?? raw.originalPrice ?? undefined,
  };
}

export async function fetchProducts(filter?: ProductFilter) {
  if (USE_MOCK) {
    let filteredItems = [...allMockProducts];
    if (filter?.keyword) {
      const k = filter.keyword.toLowerCase();
      filteredItems = filteredItems.filter(p => 
        p.name.toLowerCase().includes(k) || 
        p.categoryName?.toLowerCase().includes(k)
      );
    }
    if (filter?.categoryId) {
      filteredItems = filteredItems.filter(p => p.categoryId === filter.categoryId);
    }
    return filteredItems;
  }
  const response = await api.get<ApiResponse<Product[]>>('/api/products', { params: filter });
  return apiRequest(Promise.resolve(response));
}

export async function fetchProduct(id: string) {
  if (USE_MOCK) return getMockProduct(id);
  const response = await api.get<ApiResponse<Product>>(`/api/products/${id}`);
  return apiRequest(Promise.resolve(response));
}

export async function searchProducts(keyword: string) {
  if (USE_MOCK) {
    const k = keyword.toLowerCase();
    return allMockProducts.filter(p => p.name.toLowerCase().includes(k));
  }
  const response = await api.get<ApiResponse<Product[]>>('/api/products/search', { params: { keyword } });
  return apiRequest(Promise.resolve(response));
}

const CATEGORY_MAP: Record<number, string> = {
  1: 'Outerwear',
  2: 'Tailoring',
  3: 'Bottoms',
  4: 'Knitwear',
  5: 'Accessories',
  6: 'Ready-to-Wear',
};

export async function createProduct(request: UpsertProductRequest) {
  if (USE_MOCK) {
    const categoryName = request.categoryId ? CATEGORY_MAP[Number(request.categoryId)] : 'Uncategorized';
    const newProduct: Product = {
      id: `prod_${Math.random().toString(36).substr(2, 9)}`,
      ...request,
      categoryName,
    };
    allMockProducts.unshift(newProduct);
    return newProduct;
  }
  const response = await api.post<ApiResponse<Product>>('/api/products', request);
  return apiRequest(Promise.resolve(response));
}

export async function updateProduct(id: string, request: UpsertProductRequest) {
  if (USE_MOCK) {
    const index = allMockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      const categoryName = request.categoryId ? CATEGORY_MAP[Number(request.categoryId)] : allMockProducts[index].categoryName;
      allMockProducts[index] = {
        ...allMockProducts[index],
        ...request,
        categoryName,
      };
      return allMockProducts[index];
    }
    return { id, ...request } as Product;
  }
  const response = await api.put<ApiResponse<Product>>(`/api/products/${id}`, request);
  return apiRequest(Promise.resolve(response));
}

export async function deleteProduct(id: string) {
  if (USE_MOCK) {
    const index = allMockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      allMockProducts.splice(index, 1);
    }
    return null;
  }
  const response = await api.delete<ApiResponse<null>>(`/api/products/${id}`);
  return apiRequest(Promise.resolve(response));
}

export async function fetchManageProducts(filter?: ProductFilter) {
  if (USE_MOCK) {
    let filteredItems = [...allMockProducts];

    if (filter?.keyword) {
      const k = filter.keyword.toLowerCase();
      filteredItems = filteredItems.filter(p => 
        p.name.toLowerCase().includes(k) || 
        p.slug?.toLowerCase().includes(k) ||
        p.categoryName?.toLowerCase().includes(k)
      );
    }

    if (filter?.categoryId) {
      filteredItems = filteredItems.filter(p => p.categoryId === Number(filter.categoryId));
    }

    const page = filter?.page ?? 0;
    const size = filter?.size ?? 10;
    const start = page * size;
    const paginatedItems = filteredItems.slice(start, start + size);

    return {
      items: paginatedItems,
      total: filteredItems.length,
      page,
      size,
    };
  }
  const response = await api.get<ApiResponse<any>>('/api/products/manage', { params: filter });
  const raw = await apiRequest(Promise.resolve(response));
  if (raw && Array.isArray(raw.items)) return { ...raw, items: raw.items.map(normalizeManageProduct) };
  return raw;
}

export async function fetchManageProduct(id: string) {
  if (USE_MOCK) return getMockProduct(id);
  const response = await api.get<ApiResponse<any>>(`/api/products/manage/${id}`);
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeManageProduct(raw);
}

export async function updateManageProduct(id: string, request: UpsertProductRequest) {
  if (USE_MOCK) {
    const index = allMockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      const categoryName = request.categoryId ? CATEGORY_MAP[Number(request.categoryId)] : allMockProducts[index].categoryName;
      allMockProducts[index] = {
        ...allMockProducts[index],
        ...request,
        categoryName,
      };
      return allMockProducts[index];
    }
    return { id, ...request } as Product;
  }
  const response = await api.put<ApiResponse<Product>>(`/api/products/manage/${id}`, request);
  return apiRequest(Promise.resolve(response));
}

export async function deleteManageProduct(id: string) {
  if (USE_MOCK) {
    const index = allMockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      allMockProducts.splice(index, 1);
    }
    return null;
  }
  const response = await api.delete<ApiResponse<null>>(`/api/products/manage/${id}`);
  return apiRequest(Promise.resolve(response));
}

type StoreProductSummary = {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  categoryName: string | null;
  shortDescription: string | null;
  inStock: boolean;
  productDetailUrl: string;
};

type StorePaginatedResponse = {
  items: StoreProductSummary[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export async function fetchStoreProducts(filter?: ProductFilter): Promise<StoreProductSummary[]> {
  const response = await api.get<ApiResponse<StorePaginatedResponse>>('/api/store/products', { params: filter });
  const paginated = await apiRequest(Promise.resolve(response));
  return paginated.items;
}

export async function fetchStoreProduct(idOrSlug: string) {
  if (USE_MOCK) return getMockProduct(idOrSlug);
  const response = await api.get<ApiResponse<any>>(`/api/store/products/${idOrSlug}`);
  const raw = await apiRequest(Promise.resolve(response));
  return normalizeStoreProductDetail(raw);
}
