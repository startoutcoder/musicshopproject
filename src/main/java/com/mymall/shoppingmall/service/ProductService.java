package com.mymall.shoppingmall.service;

import com.mymall.shoppingmall.dto.CategoryDTO;
import com.mymall.shoppingmall.dto.ProductCreateDTO;
import com.mymall.shoppingmall.dto.ProductResponseDTO;
import com.mymall.shoppingmall.dto.TrackDTO;
import com.mymall.shoppingmall.exceptions.ResourceNotFoundException;
import com.mymall.shoppingmall.model.Category;
import com.mymall.shoppingmall.model.Product;
import com.mymall.shoppingmall.model.Review;
import com.mymall.shoppingmall.repository.ReviewRepository;
import com.mymall.shoppingmall.repository.CategoryRepository;
import com.mymall.shoppingmall.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ProductResponseDTO> getProductById(Long productId) {
        return productRepository.findByProductId(productId).map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductByCategory(String categoryName) {
        return productRepository.findByProductCategory_CategoryName(categoryName)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponseDTO addProduct(ProductCreateDTO createDto) {
        Category category = categoryRepository.findById(createDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + createDto.getCategoryId()));

        Product product = new Product();
        product.setProductName(createDto.getProductName());
        product.setProductPrice(createDto.getProductPrice());
        product.setProductQuantity(createDto.getProductQuantity());
        product.setImageUrl(createDto.getImageUrl());
        product.setProductCategory(category);

        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    @Transactional
    public Optional<ProductResponseDTO> updateProduct(Long id, ProductCreateDTO updateDto) {
        return productRepository.findById(id).map(existingProduct -> {
            Category category = categoryRepository.findById(updateDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + updateDto.getCategoryId()));

            existingProduct.setProductName(updateDto.getProductName());
            existingProduct.setProductPrice(updateDto.getProductPrice());
            existingProduct.setProductQuantity(updateDto.getProductQuantity());
            existingProduct.setImageUrl(updateDto.getImageUrl());
            existingProduct.setProductCategory(category);

            Product updatedProduct = productRepository.save(existingProduct);
            return convertToDto(updatedProduct);
        });
    }

    @Transactional
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private ProductResponseDTO convertToDto(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setProductId(product.getProductId());
        dto.setProductName(product.getProductName());
        dto.setProductPrice(product.getProductPrice());
        dto.setArtistName(product.getArtistName());
        dto.setProductQuantity(product.getProductQuantity());
        dto.setImageUrl(product.getImageUrl());

        if (product.getProductCategory() != null) {
            CategoryDTO categoryDto = new CategoryDTO();
            categoryDto.setCategoryId(product.getProductCategory().getCategoryId());
            categoryDto.setCategoryName(product.getProductCategory().getCategoryName());
            dto.setProductCategory(categoryDto);
        }

        if (product.getTracks() != null) {
            dto.setTrackList(
                    product.getTracks().stream()
                            .map(track -> {
                                TrackDTO trackDTO = new TrackDTO();
                                trackDTO.setTrackName(track.getTrackName());
                                trackDTO.setTrackNumber(track.getTrackNumber());
                                trackDTO.setDuration(track.getDuration());
                                return trackDTO;
                            })
                            .collect(Collectors.toList())
            );
        }

        List<Review> reviews = reviewRepository.findByProduct_ProductId(product.getProductId());
        if (reviews != null && !reviews.isEmpty()) {
            double average = reviews.stream()
                    .mapToDouble(Review::getRating)
                    .average()
                    .orElse(0.0);
            dto.setAverageRating(average);
            dto.setRatingCount(reviews.size());
        } else {
            dto.setAverageRating(0.0);
            dto.setRatingCount(0);
        }
        return dto;
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> searchProducts(String query) {
        return productRepository.findByProductNameContainingIgnoreCase(query)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> searchProductsByName(String query) {
        return productRepository.findByProductNameContainingIgnoreCase(query)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> searchAllProducts(String query) {
        return productRepository.searchProductsByQuery(query)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

}
