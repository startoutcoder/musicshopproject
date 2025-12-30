package com.mymall.shoppingmall.controller;

import com.mymall.shoppingmall.dto.AuthResponse;
import com.mymall.shoppingmall.dto.LoginRequestDTO;
import com.mymall.shoppingmall.dto.RefreshTokenRequest;
import com.mymall.shoppingmall.dto.UserCreationDTO;
import com.mymall.shoppingmall.exceptions.UserAlreadyExistsException;
import com.mymall.shoppingmall.model.User;
import com.mymall.shoppingmall.repository.UserRepository;
import com.mymall.shoppingmall.service.AuthService;
import com.mymall.shoppingmall.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/auth")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserCreationDTO request) throws UserAlreadyExistsException {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        String userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail != null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            if (jwtService.isTokenValid(refreshToken, userDetails)) {
                User user = userRepository.findByEmail(userEmail).orElseThrow();
                if (!refreshToken.equals(user.getRefreshToken())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                }
            }

            String newAccessToken = jwtService.generateToken(userDetails);

            AuthResponse authResponse = AuthResponse.builder()
                    .token(newAccessToken)
                    .refreshToken(refreshToken)
                    .build();

            return ResponseEntity.ok(authResponse);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
