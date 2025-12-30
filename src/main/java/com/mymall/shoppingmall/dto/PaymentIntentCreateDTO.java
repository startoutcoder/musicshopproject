package com.mymall.shoppingmall.dto;

import lombok.Data;
import java.util.List;

@Data
public class PaymentIntentCreateDTO {
    private List<OrderItemDTO> items; // Uses the shared DTO
}

