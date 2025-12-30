package com.mymall.shoppingmall.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDTO {
    private Long orderId;
    private LocalDateTime orderDate;
    private Double totalAmount;
    private List<OrderItemResponseDTO> items;

    @Data
    public static class OrderItemResponseDTO {
        private Long productId;
        private String productName;
        private String imageUrl;
        private Integer quantity;
        private Double priceAtPurchase;
    }
}
