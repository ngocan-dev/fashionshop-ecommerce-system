import { CategoryManagementView } from '@/features/categories/components/category-management-view';

export default function AdminCategoriesPage() {
  return <CategoryManagementView emptyActionHref="/admin/categories" />;
}
