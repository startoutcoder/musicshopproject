package com.mymall.shoppingmall.service;

import com.mymall.shoppingmall.dto.ProductSummaryDTO;
import com.mymall.shoppingmall.dto.ReviewDTO;
import com.mymall.shoppingmall.exceptions.ResourceNotFoundException;
import com.mymall.shoppingmall.model.Product;
import com.mymall.shoppingmall.model.Review;
import com.mymall.shoppingmall.model.User;
import com.mymall.shoppingmall.dto.ReviewCreateDTO;
import com.mymall.shoppingmall.repository.ProductRepository;
import com.mymall.shoppingmall.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsForProduct(Long productId) {
        return reviewRepository.findByProduct_ProductId(productId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO createReview(ReviewCreateDTO createDto, User user) {
        Product product = productRepository.findById(createDto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setTitle(createDto.getTitle());
        review.setComment(createDto.getComment());
        review.setRating(createDto.getRating());

        Review savedReview = reviewRepository.save(review);
        return convertToDto(savedReview);
    }

    private ReviewDTO convertToDto(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setTitle(review.getTitle());
        dto.setComment(review.getComment());
        dto.setRating(review.getRating());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setAuthorName(review.getUser().getUserName());
        dto.setAuthorId(review.getUser().getId());// Expose only username
        dto.setAuthorUserId(review.getUser().getUserId());

        if (review.getProduct() != null) {
            ProductSummaryDTO productSummaryDTO = new ProductSummaryDTO();
            productSummaryDTO.setProductId(review.getProduct().getProductId());
            productSummaryDTO.setProductName(review.getProduct().getProductName());
            productSummaryDTO.setImageUrl(review.getProduct().getImageUrl());
            dto.setProduct(productSummaryDTO);
        }
        return dto;
    }

    @Transactional
    public ReviewDTO updateReview(Long reviewId, ReviewCreateDTO updateDto, User user) throws AccessDeniedException {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        if (!review.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You cannot edit someone else's review");
        }
        review .setTitle(updateDto.getTitle());
        review.setComment(updateDto.getComment());
        review.setRating(updateDto.getRating());

        Review savedReview = reviewRepository.save(review);
        return convertToDto(savedReview);
    }

    public void deleteReview(Long reviewId, User user) throws AccessDeniedException {
        Review review =  reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        if (!review.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You cannot delete someone else's review");
        }
        reviewRepository.delete(review);
    }

    public List<ReviewDTO> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUser_Id(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}

