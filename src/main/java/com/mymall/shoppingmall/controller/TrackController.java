package com.mymall.shoppingmall.controller;

import com.mymall.shoppingmall.dto.TrackDTO;
import com.mymall.shoppingmall.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class TrackController {
    private final TrackService trackService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<TrackDTO>> getAllTracks(@PathVariable Long productId){
        List<TrackDTO> tracks = trackService.getTracksForProduct(productId);
        return ResponseEntity.ok(tracks);
    }
}
