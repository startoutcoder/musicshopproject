package com.mymall.shoppingmall.controller;

import com.mymall.shoppingmall.dto.*;
import com.mymall.shoppingmall.exceptions.UserAlreadyExistsException;
import com.mymall.shoppingmall.model.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.mymall.shoppingmall.service.UserService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserCreationDTO userDTO) throws UserAlreadyExistsException {
        User createdUser = userService.createUser(userDTO);
        UserDTO responseDTO = userService.convertToUserDTO(createdUser);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> getUsers = userService.getUsers();
        return new ResponseEntity<>(getUsers, HttpStatus.OK);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        UserDTO getUser = userService.getUserByEmail(email);
        return new ResponseEntity<>(getUser, HttpStatus.OK);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        UserDTO getUser = userService.getUserByUserName(username);
        return new ResponseEntity<>(getUser, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateDTO userDTO) throws UserAlreadyExistsException {
        UserDTO updated = userService.updateUser(id, userDTO);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateCurrentUserProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestBody ProfileUpdateDTO profileUpdateDTO
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDTO updatedUser = userService.updateUserProfile(currentUser.getId(), profileUpdateDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/profile/picture")
    public ResponseEntity<UserDTO> uploadProfilePicture(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDTO updatedUser = userService.updateProfilePicture(currentUser.getId(), file);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/by-userid/{userId}")
    public ResponseEntity<UserDTO> getPublicUserProfile(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUserByUserId(userId));
    }

    @PutMapping("/me/info")
    public ResponseEntity<UserDTO> updateMyInfo(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserUpdateDTO userUpdateDTO) throws UserAlreadyExistsException {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = userDetails.getUsername();
        UserDTO updatedUser = userService.updateUserByEmail(email, userUpdateDTO);

        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> updateMyPassword(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody PasswordUpdateDTO passwordUpdateDTO) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        userService.updatePassword(currentUser, passwordUpdateDTO);
        return ResponseEntity.ok().build();
    }
}
