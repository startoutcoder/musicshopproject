package com.mymall.shoppingmall.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserCreationDTO {

    @NotBlank(message = "User ID cannot be empty")
    private String userId;

    @NotBlank(message = "User password cannot be empty")
    @Size(min = 8)
    private String password;

    @NotBlank(message = "email cannot be empty")
    private String email;

    private String userName;

    private String phoneNumber;

    private String shippingAddress;

    private String billingAddress;

}
