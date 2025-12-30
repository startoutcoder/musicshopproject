package com.mymall.shoppingmall.dto;

import lombok.Data;

@Data
public class ProfileUpdateDTO {
    private String introduction;
    private Long favoriteAlbumId;
    private Boolean ratingsArePublic;
    private String userName;
}
