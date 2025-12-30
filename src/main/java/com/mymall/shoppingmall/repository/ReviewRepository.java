
package com.mymall.shoppingmall.repository;

import com.mymall.shoppingmall.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct_ProductId(Long productId);
    List<Review> findByUser_Id(Long userId);
}