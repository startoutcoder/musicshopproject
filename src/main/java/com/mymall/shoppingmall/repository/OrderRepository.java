package com.mymall.shoppingmall.repository;
import com.mymall.shoppingmall.model.Order;
import com.mymall.shoppingmall.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository

public interface OrderRepository extends JpaRepository<Order, Long> {

    Order findByOrderId(Long orderId);
    Optional<Order> findByOrderDate(LocalDateTime orderDate);
    List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);
    List<Order> findByUserOrderByOrderDateDesc(User user);
}
