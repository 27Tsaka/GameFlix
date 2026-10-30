
package com.example.gameflix.service;

import com.example.gameflix.model.User;
import com.example.gameflix.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepository);
    }

    @Test
    void registerNewUser_ShouldSucceed() {
        when(userRepository.existsByUsername("testuser"))
                .thenReturn(false);

        String result = userService.register("testuser", "password123");

        assertEquals("User registered successfully", result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerExistingUser_ShouldFail() {
        when(userRepository.existsByUsername("testuser"))
                .thenReturn(true);

        String result = userService.register("testuser", "password123");

        assertEquals("Username already exists", result);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void loginWithCorrectPassword_ShouldSucceed() {
        String hashedPassword = new BCryptPasswordEncoder()
                .encode("password123");

        User user = new User("testuser", hashedPassword);

        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(user));

        String result = userService.login("testuser", "password123");

        assertEquals("Login successful", result);
    }
}
