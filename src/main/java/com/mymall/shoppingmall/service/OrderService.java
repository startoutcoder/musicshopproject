
package com.mymall.shoppingmall.service;

import com.mymall.shoppingmall.dto.OrderCreateDTO;
import com.mymall.shoppingmall.dto.OrderItemDTO;
import com.mymall.shoppingmall.dto.OrderResponseDTO;
import com.mymall.shoppingmall.exceptions.ResourceNotFoundException;
import com.mymall.shoppingmall.model.Order;
import com.mymall.shoppingmall.model.OrderItem;
import com.mymall.shoppingmall.model.Product;
import com.mymall.shoppingmall.model.User;
import com.mymall.shoppingmall.repository.OrderRepository;
import com.mymall.shoppingmall.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    /**
     * Securely calculates the total order amount in cents from a list of items.
     * It now correctly uses the shared, top-level OrderItemDTO.
     */
    @Transactional(readOnly = true)
    public long calculateOrderAmountInCents(List<OrderItemDTO> items) {
        // Add a null check for safety
        if (items == null) {
            return 0;
        }

        double totalAmount = 0.0;

        for (OrderItemDTO itemDto : items) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemDto.getProductId()));

            totalAmount += product.getProductPrice() * itemDto.getQuantity();
        }

        return (long) (totalAmount * 100);
    }

    /**
     * Creates a new order, saves it, and returns it as a detailed OrderResponseDTO.
     */
    @Transactional
    public OrderResponseDTO createOrder(OrderCreateDTO createDto, User user) {
        userService.updateUserAddressDetails(
                user,
                createDto.getShippingAddress(),
                createDto.getBillingAddress(),
                createDto.getPhoneNumber()
        );

        Order newOrder = new Order();
        newOrder.setUser(user);
        newOrder.setOrderDate(LocalDateTime.now());

        long totalAmountCents = calculateOrderAmountInCents(createDto.getOrderItems());
        newOrder.setTotalAmount((double) totalAmountCents / 100.0);

        for (OrderItemDTO itemDto : createDto.getOrderItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemDto.getProductId()));

            if (product.getProductQuantity() < itemDto.getQuantity()) {
                throw new IllegalStateException("Not enough stock for product: " + product.getProductName());
            }
            product.setProductQuantity(product.getProductQuantity() - itemDto.getQuantity());

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPriceAtPurchase(product.getProductPrice());
            newOrder.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(newOrder);
        return convertToResponseDto(savedOrder);
    }

    /**
     * Retrieves all orders for a specific user.
     */
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getOrdersForUser(User user) {
        return orderRepository.findByUserOrderByOrderDateDesc(user)
                .stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Converts an Order entity into the detailed OrderResponseDTO.
     */
    private OrderResponseDTO convertToResponseDto(Order order) {
        OrderResponseDTO orderDto = new OrderResponseDTO();
        orderDto.setOrderId(order.getOrderId());
        orderDto.setOrderDate(order.getOrderDate());
        orderDto.setTotalAmount(order.getTotalAmount());

        List<OrderResponseDTO.OrderItemResponseDTO> itemDtos = order.getItems().stream().map(item -> {
            OrderResponseDTO.OrderItemResponseDTO itemDto = new OrderResponseDTO.OrderItemResponseDTO();
            itemDto.setProductId(item.getProduct().getProductId());
            itemDto.setProductName(item.getProduct().getProductName());
            itemDto.setImageUrl(item.getProduct().getImageUrl());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setPriceAtPurchase(item.getPriceAtPurchase());
            return itemDto;
        }).collect(Collectors.toList());

        orderDto.setItems(itemDtos);
        return orderDto;
    }
}
