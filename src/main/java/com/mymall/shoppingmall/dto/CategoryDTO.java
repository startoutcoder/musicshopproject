package com.mymall.shoppingmall.dto;

import lombok.Data;

import java.util.List;

@Data
public class CategoryDTO {
    private Long categoryId;
    private String categoryName;
    private String categoryDescription;
    private List<CategoryDTO> children;
}

