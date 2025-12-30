package com.mymall.shoppingmall.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryCreateDTO {
    @NotBlank
    private String categoryName;
    private String categoryDescription;
}
