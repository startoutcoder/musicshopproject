package com.mymall.shoppingmall.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewCreateDTO {
    @NotNull
    private Long productId;

    @NotBlank
    private String title;

    private String comment;

    @DecimalMin(value = "0.5", message = "Rating must be at least 0.5")
    @DecimalMax(value = "5.0", message = "Rating must be at most 5.0")
    @NotNull
    private Double rating;
}