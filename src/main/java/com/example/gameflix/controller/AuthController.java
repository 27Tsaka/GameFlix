package com.example.gameflix.controller;

import com.example.gameflix.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        String result = userService.register(username, password);

        if (result.equals("Username already exists")) {
            return ResponseEntity.badRequest().body(Map.of("message", result));
        }

        return ResponseEntity.ok(Map.of("message", result));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        String result = userService.login(username, password);

        if (result.equals("Invalid username or password")) {
            return ResponseEntity.badRequest().body(Map.of("message", result));
        }

        return ResponseEntity.ok(Map.of("message", result));
    }
}