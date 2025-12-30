package com.mymall.shoppingmall.service;

import com.mymall.shoppingmall.dto.AuthResponse;
import com.mymall.shoppingmall.dto.LoginRequestDTO;
import com.mymall.shoppingmall.dto.UserCreationDTO;
import com.mymall.shoppingmall.dto.UserDTO;
import com.mymall.shoppingmall.exceptions.UserAlreadyExistsException;
import com.mymall.shoppingmall.model.User;
import com.mymall.shoppingmall.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthResponse login (LoginRequestDTO request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken
                (request.getEmail(), request.getPassword()));
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        user.setRefreshToken(refreshToken);
        userRepository.save(user);
        UserDTO userDTO = userService.convertToUserDTO(user);
        return AuthResponse.builder().token(jwtToken).userDTO(userDTO).build();
    }

    public AuthResponse register (UserCreationDTO request) throws UserAlreadyExistsException {
        User saved = userService.createUser(request);
        var jwtToken = jwtService.generateToken(saved);
        UserDTO userDTO = userService.convertToUserDTO(saved);
        return AuthResponse.builder().token(jwtToken).userDTO(userDTO).build();
    }

}