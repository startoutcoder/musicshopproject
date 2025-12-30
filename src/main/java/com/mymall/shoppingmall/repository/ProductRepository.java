package com.mymall.shoppingmall.repository;
import com.mymall.shoppingmall.model.Category;
import com.mymall.shoppingmall.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByProductId (Long productId);
    List<Product> findByProductPrice (double price);
    List<Product> findByProductName (String productName);
    List<Product> findByProductCategory_CategoryName(String categoryName);
    List<Product> findByProductNameContainingIgnoreCase(String productName);

    @Query("SELECT p FROM Product p LEFT JOIN p.productCategory c " +
            "WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(p.artistName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProductsByQuery(@Param("query") String query);


}
