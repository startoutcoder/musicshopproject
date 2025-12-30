package com.mymall.shoppingmall.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class OrderCreateDTO {
    @NotEmpty
    private List<OrderItemDTO> orderItems; // Uses the shared DTO
    private String shippingAddress;
    private String billingAddress;
    private String phoneNumber;
}