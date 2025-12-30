
package com.mymall.shoppingmall.controller;

import com.mymall.shoppingmall.dto.OrderCreateDTO;
import com.mymall.shoppingmall.dto.OrderResponseDTO;
import com.mymall.shoppingmall.model.User;
import com.mymall.shoppingmall.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * Endpoint for a logged-in user to create a new order from their cart.
     */
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(
            @RequestBody OrderCreateDTO createDto,
            @AuthenticationPrincipal User user
    ) {
        OrderResponseDTO createdOrder = orderService.createOrder(createDto, user);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    /**
     * Endpoint for a logged-in user to retrieve their own order history.
     */
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getOrdersForUser(user));
    }
}