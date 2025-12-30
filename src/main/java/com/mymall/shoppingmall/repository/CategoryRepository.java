package com.mymall.shoppingmall.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import com.mymall.shoppingmall.model.Category;



public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByCategoryName(String categoryName);
    boolean existsByCategoryName(String categoryName);

}
