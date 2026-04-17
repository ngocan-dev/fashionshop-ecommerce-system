package com.example.fashionshop.modules.dashboard.service;

import com.example.fashionshop.common.exception.HomeDataLoadException;
import com.example.fashionshop.modules.category.entity.Category;
import com.example.fashionshop.modules.category.repository.CategoryRepository;
import com.example.fashionshop.modules.dashboard.dto.HomeBannerDto;
import com.example.fashionshop.modules.dashboard.dto.HomeCategoryDto;
import com.example.fashionshop.modules.dashboard.dto.HomeProductDto;
import com.example.fashionshop.modules.dashboard.dto.HomeResponseDto;
import com.example.fashionshop.modules.dashboard.entity.Banner;
import com.example.fashionshop.modules.dashboard.repository.BannerRepository;
import com.example.fashionshop.modules.product.entity.Product;
import com.example.fashionshop.modules.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BannerRepository bannerRepository;

    @Override
    @Transactional(readOnly = true)
    public HomeResponseDto getHomeData() {
        try {
            List<HomeProductDto> featuredProducts = productRepository
                    .findTop8FeaturedActiveWithCategory(PageRequest.of(0, 8))
                    .stream()
                    .map(this::toHomeProduct)
                    .toList();

            List<HomeCategoryDto> categories = categoryRepository
                    .findTop8ByIsActiveTrueOrderByNameAsc()
                    .stream()
                    .map(this::toHomeCategory)
                    .toList();

            List<HomeBannerDto> banners = bannerRepository
                    .findTop5ByIsActiveTrueOrderByDisplayOrderAsc()
                    .stream()
                    .map(this::toHomeBanner)
                    .toList();

            return HomeResponseDto.builder()
                    .featuredProducts(featuredProducts)
                    .categories(categories)
                    .banners(banners)
                    .build();
        } catch (Exception ex) {
            throw new HomeDataLoadException();
        }
    }

    private HomeProductDto toHomeProduct(Product product) {
        return HomeProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .categoryName(product.getCategory().getName())
                .build();
    }

    private HomeCategoryDto toHomeCategory(Category category) {
        return HomeCategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .build();
    }

    private HomeBannerDto toHomeBanner(Banner banner) {
        return HomeBannerDto.builder()
                .id(banner.getId())
                .title(banner.getTitle())
                .imageUrl(banner.getImageUrl())
                .linkUrl(banner.getLinkUrl())
                .build();
    }
}