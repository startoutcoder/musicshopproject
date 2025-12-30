package com.mymall.shoppingmall.repository;

import com.mymall.shoppingmall.model.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrackRepository extends JpaRepository<Track, Integer> {

    List<Track> findByProductProductIdOrderByTrackNumberAsc(Long productId);
}