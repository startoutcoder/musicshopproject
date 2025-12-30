package com.mymall.shoppingmall.repository;

import com.mymall.shoppingmall.dto.UserCreationDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import com.mymall.shoppingmall.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository <User, Long> {

    Optional<User> findUserByPhoneNumber(String phoneNumber);
    Optional<User> findByEmail(@NotBlank(message = "email cannot be empty") String email);
    Optional<User> findByUserName(String userName);
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByUserId(String userId);
}
