export type Category = {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
};

export type UpsertCategoryRequest = {
  name: string;
  description?: string;
  active?: boolean;
};
