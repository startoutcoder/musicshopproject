package com.mymall.shoppingmall.service;

import com.mymall.shoppingmall.dto.TrackDTO;
import com.mymall.shoppingmall.model.Track;
import com.mymall.shoppingmall.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrackService {

    private final TrackRepository trackRepository;

    /**
     * Retrieves the tracklist for a given product ID.
     */
    @Transactional(readOnly = true)
    public List<TrackDTO> getTracksForProduct(Long productId) {
        List<Track> tracks = trackRepository.findByProductProductIdOrderByTrackNumberAsc(productId);
        return tracks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Converts a Track entity to a TrackDTO.
     */
    private TrackDTO convertToDto(Track track) {
        TrackDTO dto = new TrackDTO();
        dto.setId(track.getId());
        dto.setTrackNumber(track.getTrackNumber());
        dto.setTrackName(track.getTrackName());
        dto.setDuration(track.getDuration());
        return dto;
    }
}
