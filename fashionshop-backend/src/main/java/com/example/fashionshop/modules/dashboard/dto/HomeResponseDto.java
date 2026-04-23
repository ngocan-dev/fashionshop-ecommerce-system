package com.example.fashionshop.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class HomeResponseDto {
    private List<HomeProductDto> featuredProducts;
    private List<HomeProductDto> newArrivals;
    private List<HomeCategoryDto> categories;
    private List<HomeBannerDto> banners;
}
