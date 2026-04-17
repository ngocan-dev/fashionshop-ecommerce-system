package com.example.fashionshop.modules.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductManageUpdateRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 150, message = "Product name cannot exceed 150 characters")
    private String name;

    private String description;

    @NotNull(message = "Category is required")
    private Integer categoryId;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be a valid non-negative number")
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be a valid non-negative integer")
    private Integer stockQuantity;

    @Size(max = 10, message = "Maximum 10 images are allowed")
    private List<@NotBlank(message = "Image URL cannot be blank") @Size(max = 500, message = "Image URL is too long") String> imageUrls;

    @NotNull(message = "Status is required")
    private ProductStatus status;
}
