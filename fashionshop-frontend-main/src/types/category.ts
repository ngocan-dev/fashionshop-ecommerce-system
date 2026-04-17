export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active?: boolean;
};

export type UpsertCategoryRequest = {
  name: string;
  slug: string;
  description?: string;
  active?: boolean;
};
