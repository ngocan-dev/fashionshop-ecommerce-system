package com.example.fashionshop.modules.category.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.modules.category.dto.CategoryRequest;
import com.example.fashionshop.modules.category.dto.CategoryResponse;
import com.example.fashionshop.modules.category.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAll() {
        return ApiResponse.success("Categories fetched successfully", categoryService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        return ApiResponse.success("Category created successfully", categoryService.create(request));
    }
}
