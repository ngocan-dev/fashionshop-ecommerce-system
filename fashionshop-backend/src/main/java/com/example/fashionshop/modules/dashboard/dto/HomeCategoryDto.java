package com.example.fashionshop.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HomeCategoryDto {
    private Integer id;
    private String name;
    private String description;
    private String imageUrl;
}