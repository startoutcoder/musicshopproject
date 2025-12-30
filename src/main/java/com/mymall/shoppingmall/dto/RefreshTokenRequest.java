package com.mymall.shoppingmall.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest {

    @NotBlank(message = "Refresh token cannot be empty.")
    private String refreshToken;
}