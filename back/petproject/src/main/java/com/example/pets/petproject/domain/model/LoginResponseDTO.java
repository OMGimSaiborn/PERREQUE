package com.example.pets.petproject.domain.model;

public record LoginResponseDTO(
        boolean success,
        String message,
        String username,
        Boolean isAdmin,
        Integer id,
        String token, // JWT
        String role,
        Integer shelterId // solo usuarios SHELTER; null en otros
) {}
