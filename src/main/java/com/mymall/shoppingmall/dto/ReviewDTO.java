package com.mymall.shoppingmall.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Long id;
    private String title;
    private String comment;
    private Double rating;
    private LocalDateTime createdAt;
    private String authorName;
    private Long authorId;
    private ProductSummaryDTO product;
    private String authorUserId;
}
