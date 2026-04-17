import { CategoryFilter, type CategoryOption } from './category-filter';
import { ColorFilter, type ColorOption } from './color-filter';
import { PriceFilter } from './price-filter';
import { SizeFilter } from './size-filter';

type FilterSidebarProps = {
  categoryOptions: CategoryOption[];
  sizeOptions: string[];
  colorOptions: ColorOption[];
  selectedCategory: string;
  selectedSizes: string[];
  selectedColor: string;
  priceRange: number;
  onCategoryChange: (categoryId: string) => void;
  onToggleSize: (size: string) => void;
  onColorChange: (colorId: string) => void;
  onPriceChange: (value: number) => void;
  minPrice?: number;
  maxPrice?: number;
};

export function FilterSidebar({
  categoryOptions,
  sizeOptions,
  colorOptions,
  selectedCategory,
  selectedSizes,
  selectedColor,
  priceRange,
  onCategoryChange,
  onToggleSize,
  onColorChange,
  onPriceChange,
  minPrice = 0,
  maxPrice = 2000,
}: FilterSidebarProps) {
  return (
    <aside className="w-full bg-white p-6 lg:w-[290px] lg:p-7">
      <div className="space-y-10">
        <CategoryFilter options={categoryOptions} selectedCategory={selectedCategory} onChange={onCategoryChange} />
        <SizeFilter sizes={sizeOptions} selectedSizes={selectedSizes} onToggleSize={onToggleSize} />
        <ColorFilter colors={colorOptions} selectedColor={selectedColor} onChange={onColorChange} />
        <PriceFilter min={minPrice} max={maxPrice} value={priceRange} onChange={onPriceChange} />
      </div>
    </aside>
  );
}
