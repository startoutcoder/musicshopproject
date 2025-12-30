package com.mymall.shoppingmall.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UserUpdateDTO {

    private String userName;

    @Email(message = "Invalid email format")
    private String email;

    private String shippingAddress;
    private String billingAddress;

    @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Invalid phone number")
    private String phoneNumber;


}
