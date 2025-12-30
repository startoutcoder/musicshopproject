package com.mymall.shoppingmall.dto;
import lombok.Data;

import java.util.List;

@Data
public class ProductResponseDTO {
    private Long productId;
    private Integer productQuantity;
    private String productName;
    private Double ProductPrice;
    private String artistName;
    private String imageUrl;
    private CategoryDTO productCategory;
    private List<TrackDTO> trackList;
    private Double averageRating;
    private Integer ratingCount;
}
