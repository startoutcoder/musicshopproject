package com.mymall.shoppingmall.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Table(name = "user")
@Entity
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "userId", nullable = false, unique = true)
    private String userId;

    @Column(name = "userPW", nullable = false)
    private String password;

    @Column(name = "userMail", nullable = false, unique = true)
    private String email;

    @Column(name = "userName", nullable = false)
    private String userName;

    private String shippingAddress;
    private String billingAddress;
    private String phoneNumber;

    @Column(name = "userRole", nullable = false)
    private String role;

    @Column(name = "verified", nullable = false)
    private boolean verified;

    @Lob
    @Column(name = "profile_picture", columnDefinition="LONGBLOB")
    private byte[] profilePicture;

    @Lob
    private String introduction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "favorite_album_id")
    private Product favoriteAlbum;

    @Column(nullable = false)
    private Boolean ratingsArePublic = true;

    @Column(name = "refresh_token", unique = true)
    private String refreshToken;


    public User() {}

    public void updateShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public void updateBillingAddress(String billingAddress) {
        this.billingAddress = billingAddress;
    }

    public void updateMailAddress(String mailAddress) {
        email = mailAddress;
    }

    public void updatePhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public boolean verifyPassword(String password) { return this.password.equals(password); }

    public String getUserName() {
        return userName;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}