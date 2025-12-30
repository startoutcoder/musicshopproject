
package com.mymall.shoppingmall.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "Category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @Column(nullable = false, unique = true)
    private String categoryName;

    private String categoryDescription;

    // A category can have one parent. This is a self-referencing relationship.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    // A category can have many children.
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Category> children = new HashSet<>();

    // The relationship to Products remains.
    @OneToMany(mappedBy = "productCategory")
    private Set<Product> products = new HashSet<>();

    public Category() {}

    public Category(String categoryName, String categoryDescription) {
        this.categoryName = categoryName;
        this.categoryDescription = categoryDescription;
    }

    // --- FIX: Updated these methods to use the correct field name ---
    public void addProduct(Product product) {
        this.products.add(product);
        if (product.getProductCategory() != this) {
            product.setProductCategory(this);
        }
    }

    public void removeProduct(Product product) {
        if (product.getProductCategory() == this) {
            product.setProductCategory(null);
        }
    }
    // --- END FIX ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Category category = (Category) o;
        return categoryId.equals(category.categoryId);
    }
}