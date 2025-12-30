package com.mymall.shoppingmall.dto;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String userId;
    private String email;
    private String userName;
    private String phoneNumber;
    private String role;
    private String shippingAddress;
    private String billingAddress;
    private String profilePicture;
    private String introduction;
    private ProductResponseDTO favoriteAlbum;
    private boolean verified;
    private boolean ratingsArePublic;
}
