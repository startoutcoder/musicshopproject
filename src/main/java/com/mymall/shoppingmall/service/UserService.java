package com.mymall.shoppingmall.service;

import com.mymall.shoppingmall.dto.*;
import com.mymall.shoppingmall.exceptions.ResourceNotFoundException;
import com.mymall.shoppingmall.exceptions.UserAlreadyExistsException;
import com.mymall.shoppingmall.model.Product;
import com.mymall.shoppingmall.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.mymall.shoppingmall.model.User;
import com.mymall.shoppingmall.repository.UserRepository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProductRepository productRepository;


    @Transactional
    public User createUser (UserCreationDTO userCreationDTO) throws UserAlreadyExistsException {
        if (userRepository.findByEmail(userCreationDTO.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("The email already exists");
        }
        if (userRepository.findByUserName(userCreationDTO.getUserName()).isPresent()) {
            throw new UserAlreadyExistsException("Username" +  userCreationDTO.getUserName() + " already exists");
        }
        if (userCreationDTO.getUserId() != null && userRepository.findByUserId(userCreationDTO.getUserId()).isPresent()) {
            throw new UserAlreadyExistsException("User id" + userCreationDTO.getUserId() + " already exists");
        }
        if (userCreationDTO.getPhoneNumber() != null && userRepository.findByPhoneNumber(userCreationDTO.getPhoneNumber()).isPresent()) {
            throw new UserAlreadyExistsException("Phone number already exists");
        }

        User user = new User();
        user.setUserId(userCreationDTO.getUserId());
        user.setUserName(userCreationDTO.getUserName());
        user.setEmail(userCreationDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userCreationDTO.getPassword()));
        user.setRole("USER");
        user.setPhoneNumber(userCreationDTO.getPhoneNumber() != null ? userCreationDTO.getPhoneNumber() : "");
        user.setVerified(false);
        user.setShippingAddress(userCreationDTO.getShippingAddress() != null ? userCreationDTO.getShippingAddress() : "");
        user.setBillingAddress(userCreationDTO.getBillingAddress() != null ? userCreationDTO.getBillingAddress() : "");

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getUsers() {
        return userRepository.findAll().stream().map(this :: convertToUserDTO).collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public UserDTO getUserByEmail(String email) throws ResourceNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return convertToUserDTO(user);
    }

    @Transactional(readOnly = true)
    public UserDTO getUserByPhone(String phone) throws ResourceNotFoundException {
        User user = userRepository.findUserByPhoneNumber(phone)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with phone number: " + phone));
        return convertToUserDTO(user);
    }

    @Transactional(readOnly = true)
    public UserDTO getUserByUserName(String userName) throws ResourceNotFoundException {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + userName));
        return convertToUserDTO(user);
    }

    public UserDTO getUserById(Long id) throws ResourceNotFoundException {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertToUserDTO(user);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserUpdateDTO userUpdateDTO) throws ResourceNotFoundException, UserAlreadyExistsException {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Check and update Username
        if (userUpdateDTO.getUserName() != null) {
            if (!userUpdateDTO.getUserName().equals(existingUser.getUserName())) {
                if (userRepository.findByUserName(userUpdateDTO.getUserName()).isPresent()) {
                    throw new UserAlreadyExistsException("Username is already taken");
                }
                existingUser.setUserName(userUpdateDTO.getUserName());
            }
        }

        // Check and update Email
        if (userUpdateDTO.getEmail() != null && !userUpdateDTO.getEmail().isEmpty()) {
            if (!userUpdateDTO.getEmail().equals(existingUser.getEmail())) {
                if (userRepository.findByEmail(userUpdateDTO.getEmail()).isPresent()) {
                    throw new UserAlreadyExistsException("Email is already in use");
                }
                existingUser.setEmail(userUpdateDTO.getEmail());
            }
        }

        if (userUpdateDTO.getPhoneNumber() != null && !userUpdateDTO.getPhoneNumber().isEmpty()) {
            if (!userUpdateDTO.getPhoneNumber().equals(existingUser.getPhoneNumber())) {
                if (userRepository.findByPhoneNumber(userUpdateDTO.getPhoneNumber()).isPresent()) {
                    throw new UserAlreadyExistsException("Phone number is already in use");
                }
                existingUser.setPhoneNumber(userUpdateDTO.getPhoneNumber());
            }
        }

        // Update other fields without uniqueness checks
        if (userUpdateDTO.getBillingAddress() != null) {
            existingUser.setBillingAddress(userUpdateDTO.getBillingAddress());
        }
        if (userUpdateDTO.getShippingAddress() != null) {
            existingUser.setShippingAddress(userUpdateDTO.getShippingAddress());
        }

        User updatedUser = userRepository.save(existingUser);
        return convertToUserDTO(updatedUser);
    }

    public void deleteUser(Long id) throws ResourceNotFoundException {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public UserDTO convertToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setUserName(user.getUserName());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());
        userDTO.setUserId(user.getUserId());
        userDTO.setShippingAddress(user.getShippingAddress());
        userDTO.setBillingAddress(user.getBillingAddress());
        userDTO.setIntroduction(user.getIntroduction());
        userDTO.setRatingsArePublic(user.getRatingsArePublic());
        if (user.getProfilePicture() != null && user.getProfilePicture().length > 0) {
            String base64Image = Base64.getEncoder().encodeToString(user.getProfilePicture());
            userDTO.setProfilePicture("data:image/jpeg;base64," + base64Image);
        } else {
            userDTO.setProfilePicture(null);
        }
        if (user.getFavoriteAlbum() != null) {
            ProductResponseDTO albumDto = new ProductResponseDTO();
            albumDto.setProductId(user.getFavoriteAlbum().getProductId());
            albumDto.setProductName(user.getFavoriteAlbum().getProductName());
            albumDto.setImageUrl(user.getFavoriteAlbum().getImageUrl());
            userDTO.setFavoriteAlbum(albumDto);
        }
        return userDTO;
    }


    @Transactional(readOnly = true)
    public UserDTO getUserByUserId(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return convertToUserDTO(user);
    }


    @Transactional
    public UserDTO updateUserProfile(Long userId, ProfileUpdateDTO profileUpdateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setIntroduction(profileUpdateDTO.getIntroduction());

        if (profileUpdateDTO.getFavoriteAlbumId() != null) {
            Product favoriteAlbum = productRepository.findById(profileUpdateDTO.getFavoriteAlbumId())
                    .orElseThrow(() -> new ResourceNotFoundException("Favorite album not found"));
            user.setFavoriteAlbum(favoriteAlbum);
        } else {
            user.setFavoriteAlbum(null);
        }

        if (profileUpdateDTO.getRatingsArePublic() != null) {
            user.setRatingsArePublic(profileUpdateDTO.getRatingsArePublic());
        }

        if (profileUpdateDTO.getUserName() != null) {
            user.setUserName(profileUpdateDTO.getUserName());
        }
        if (profileUpdateDTO.getIntroduction() != null) {
            user.setIntroduction(profileUpdateDTO.getIntroduction());
        }

        User updatedUser = userRepository.save(user);
        return convertToUserDTO(updatedUser);
    }

    @Transactional
    public UserDTO updateProfilePicture(Long userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setProfilePicture(file.getBytes());

        User updatedUser = userRepository.save(user);
        return convertToUserDTO(updatedUser);
    }


    @Transactional
    public void updateUserAddressDetails(User user, String shipping, String billing, String phone) {
        boolean needsUpdate = false;
        if (shipping != null && !shipping.equals(user.getShippingAddress())) {
            user.setShippingAddress(shipping);
            needsUpdate = true;
        }
        if (billing != null && !billing.equals(user.getBillingAddress())) {
            user.setBillingAddress(billing);
            needsUpdate = true;
        }
        if (phone != null && !phone.equals(user.getPhoneNumber())) {
            user.setPhoneNumber(phone);
            needsUpdate = true;
        }

        if (needsUpdate) {
            userRepository.save(user);
        }
    }

    @Transactional
    public void updatePassword(User currentUser, PasswordUpdateDTO passwordUpdateDTO) {
        if (!passwordEncoder.matches(passwordUpdateDTO.getCurrentPassword(), currentUser.getPassword())) {
            throw new IllegalArgumentException("Incorrect current password.");
        }

        currentUser.setPassword(passwordEncoder.encode(passwordUpdateDTO.getNewPassword()));
        userRepository.save(currentUser);
    }

    @Transactional
    public UserDTO updateUserByEmail(String email, UserUpdateDTO userUpdateDTO) throws UserAlreadyExistsException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        return this.updateUser(user.getId(), userUpdateDTO);
    }

    @Transactional
    public void updatePasswordByEmail(String email, PasswordUpdateDTO passwordUpdateDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        if (!passwordEncoder.matches(passwordUpdateDTO.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect current password.");
        }

        user.setPassword(passwordEncoder.encode(passwordUpdateDTO.getNewPassword()));
        userRepository.save(user);
    }
}
