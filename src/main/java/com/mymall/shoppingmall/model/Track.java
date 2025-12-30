package com.mymall.shoppingmall.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import org.apache.logging.log4j.util.Lazy;

@Data
@Entity
@NoArgsConstructor
public class Track {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int trackNumber;
    private String trackName;
    private String duration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference
    private Product product;

    public Track(int trackNumber, String trackName, String duration, Product product) {
        this.trackNumber = trackNumber;
        this.trackName = trackName;
        this.duration = duration;
        this.product = product;
    }
}
