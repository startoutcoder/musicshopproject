package com.mymall.shoppingmall.dto;

import lombok.Data;

@Data
public class ProductSummaryDTO {
    private Long productId;
    private String productName;
    private String imageUrl;
}