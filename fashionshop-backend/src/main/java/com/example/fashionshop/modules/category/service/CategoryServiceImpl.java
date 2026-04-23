package com.example.fashionshop.modules.category.service;

import com.example.fashionshop.common.exception.ResourceNotFoundException;
import com.example.fashionshop.common.util.SecurityUtil;
import com.example.fashionshop.modules.category.dto.CategoryRequest;
import com.example.fashionshop.modules.category.dto.CategoryResponse;
import com.example.fashionshop.modules.category.entity.Category;
import com.example.fashionshop.modules.category.repository.CategoryRepository;
import com.example.fashionshop.modules.user.entity.User;
import com.example.fashionshop.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Override
    public CategoryResponse create(CategoryRequest request) {
        String email = SecurityUtil.getCurrentUsername();
        if (!StringUtils.hasText(email)) {
            throw new ResourceNotFoundException("User not found");
        }
        User creator = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = Category.builder()
                .name(request.getName().trim())
                .description(normalizeOptional(request.getDescription()))
                .createdBy(creator)
                .build();

        Category saved = categoryRepository.save(category);
        return CategoryResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .description(saved.getDescription())
                .build();
    }

    @Override
    public List<CategoryResponse> getAll() {
        return categoryRepository.findByIsActiveTrueOrderByNameAsc().stream()
                .map(c -> CategoryResponse.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .description(c.getDescription())
                        .build())
                .toList();
    }
}
