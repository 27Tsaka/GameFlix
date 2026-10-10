package com.example.gameflix.service;

import com.example.gameflix.model.User;
import com.example.gameflix.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public String register(String username, String password) {
        if (userRepository.existsByUsername(username)) {
            return "Username already exists";
        }

        String hashedPassword = passwordEncoder.encode(password);

        User user = new User(username, hashedPassword);
        userRepository.save(user);

        return "User registered successfully";
    }

    public String login(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            return "Invalid username or password";
        }

        User user = userOptional.get();

        if (passwordEncoder.matches(password, user.getPassword())) {
            return "Login successful";
        }

        return "Invalid username or password";
    }
}