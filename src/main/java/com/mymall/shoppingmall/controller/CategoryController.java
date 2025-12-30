
package com.mymall.shoppingmall.controller;

import com.mymall.shoppingmall.dto.CategoryCreateDTO;
import com.mymall.shoppingmall.dto.CategoryDTO;
import com.mymall.shoppingmall.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor // Use constructor injection for consistency
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Public endpoint to get all categories.
     * Returns a list of DTOs, not raw entities.
     */
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    /**
     * Public endpoint to get a single category by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Admin-only endpoint to create a new category.
     * Accepts a DTO and returns a DTO.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryCreateDTO createDto) {
        CategoryDTO newCategory = categoryService.createCategory(createDto);
        return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
    }

    /**
     * Admin-only endpoint to update an existing category.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryCreateDTO updateDto) {
        CategoryDTO updatedCategory = categoryService.updateCategory(id, updateDto);
        return ResponseEntity.ok(updatedCategory);
    }

    /**
     * Admin-only endpoint to delete a category.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategoryById(id);
        return ResponseEntity.noContent().build();
    }
}