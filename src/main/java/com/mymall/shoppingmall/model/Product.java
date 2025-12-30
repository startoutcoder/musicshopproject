// src/main/java/com/mymall/shoppingmall/model/Product.java

package com.mymall.shoppingmall.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Data
@Table(name = "Product")
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(name = "Quantity", nullable = false)
    private Integer productQuantity;

    @Column(name = "ProductName", nullable = false)
    private String productName;

    @Column(name = "Price", nullable = false)
    private Double productPrice;

    @ManyToOne
    @JoinColumn(name = "Category_id", referencedColumnName = "categoryId")
    @JsonBackReference
    private Category productCategory;

    @Getter
    @Setter
    private String imageUrl;

    @Column(name = "Artist_name", nullable = false)
    private String artistName;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Track> tracks = new ArrayList<>();

    public Product(Integer productQuantity, String productName, Double productPrice, String imageUrl) {
        this.productQuantity = productQuantity;
        this.productName = productName;
        this.productPrice = productPrice;
        this.imageUrl = imageUrl;
    }

    public Product() {
    }

    public boolean isOutOfStock() { return productQuantity == 0; }
    public void decreaseProductQuantity() { productQuantity--; }
    public void increaseProductQuantity() { productQuantity++; }
    public void updateProductPrice(Double productPrice) { this.productPrice = productPrice; }

    public void addTrack(Track track) {
        tracks.add(track);
        track.setProduct(this);
    }


}