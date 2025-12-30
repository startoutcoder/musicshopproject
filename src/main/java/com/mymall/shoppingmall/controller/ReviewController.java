package com.mymall.shoppingmall.controller;

import com.mymall.shoppingmall.dto.ReviewCreateDTO;
import com.mymall.shoppingmall.dto.ReviewDTO;
import com.mymall.shoppingmall.model.User;
import com.mymall.shoppingmall.dto.UserDTO;
import com.mymall.shoppingmall.service.AuthService;
import com.mymall.shoppingmall.service.ReviewService;
import com.mymall.shoppingmall.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsForProduct(productId));
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> postReview(
            @Valid @RequestBody ReviewCreateDTO createDto,
            @AuthenticationPrincipal User user
    ) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ReviewDTO createdReview = reviewService.createReview(createDto, user);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> updateReview(@PathVariable Long reviewId,
                                                  @Valid @RequestBody ReviewCreateDTO updateDTO,
                                                  @AuthenticationPrincipal User user) throws AccessDeniedException {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ReviewDTO updated = reviewService.updateReview(reviewId, updateDTO, user);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> deleteReview(@PathVariable Long reviewId, @AuthenticationPrincipal User user) throws AccessDeniedException {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        reviewService.deleteReview(reviewId, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUserId(@PathVariable Long userId, @AuthenticationPrincipal User requester) {
        UserDTO owner = userService.getUserById(userId);
        boolean isOwner = requester != null && requester.getId().equals(owner.getId());

        if (owner.isRatingsArePublic() && isOwner) {
            return ResponseEntity.ok(reviewService.getReviewsByUserId(userId));
        } else {
            return ResponseEntity.ok(List.of());
        }
    }
}
