
package com.mymall.shoppingmall.service;

import com.mymall.shoppingmall.dto.CategoryCreateDTO;
import com.mymall.shoppingmall.dto.CategoryDTO;
import com.mymall.shoppingmall.model.Category;
import com.mymall.shoppingmall.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * Creates a new category from a DTO, saves it, and returns the result as a DTO.
     */
    @Transactional
    public CategoryDTO createCategory(CategoryCreateDTO createDto) {
        if (categoryRepository.existsByCategoryName(createDto.getCategoryName())) {
            throw new IllegalArgumentException("Category with name '" + createDto.getCategoryName() + "' already exists");
        }
        Category newCategory = new Category();
        newCategory.setCategoryName(createDto.getCategoryName());
        newCategory.setCategoryDescription(createDto.getCategoryDescription());

        Category savedCategory = categoryRepository.save(newCategory);
        return convertToDto(savedCategory);
    }

    /**
     * Updates an existing category and returns the updated version as a DTO.
     */
    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryCreateDTO categoryInfo) {
        return categoryRepository.findById(id).map(existingCategory -> {
            existingCategory.setCategoryName(categoryInfo.getCategoryName());
            existingCategory.setCategoryDescription(categoryInfo.getCategoryDescription());
            Category updatedCategory = categoryRepository.save(existingCategory);
            return convertToDto(updatedCategory);
        }).orElseThrow(() -> new IllegalArgumentException("Category with Id: " + id + " does not exist"));
    }

    /**
     * Retrieves all categories and returns them as a list of DTOs.
     */
    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single category by its ID and returns it as a DTO.
     */
    @Transactional(readOnly = true)
    public Optional<CategoryDTO> getCategoryById(Long id) {
        return categoryRepository.findById(id).map(this::convertToDto);
    }

    @Transactional
    public void deleteCategoryById(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category with id " + id + " does not exist");
        }
        categoryRepository.deleteById(id);
    }

    /**
     * Private helper method to convert a Category entity to a CategoryDTO.
     */
    private CategoryDTO convertToDto(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setCategoryName(category.getCategoryName());
        dto.setCategoryDescription(category.getCategoryDescription());
        return dto;
    }
}
