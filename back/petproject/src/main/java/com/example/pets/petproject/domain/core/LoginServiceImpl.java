package com.example.pets.petproject.domain.core;

import com.example.pets.petproject.domain.enums.UserRole;
import com.example.pets.petproject.domain.model.LoginRequestDTO;
import com.example.pets.petproject.domain.model.LoginResponseDTO;
import com.example.pets.petproject.domain.port.UserRepositoryDB;
import com.example.pets.petproject.domain.service.LoginService;
import com.example.pets.petproject.infraestructure.entity.UserEntity;
import com.example.pets.petproject.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import at.favre.lib.crypto.bcrypt.BCrypt;

import static com.example.pets.petproject.utils.Constants.*;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private UserRepositoryDB userRepositoryDB;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public LoginResponseDTO login(final LoginRequestDTO dto) {

        UserEntity user = userRepositoryDB.findByEmail(dto.email())
                .orElse(null);

        if (user == null) {
            return new LoginResponseDTO(false, USER_NOT_FOUND, null, null, null, null, null, null);
        }

        boolean matches = BCrypt.verifyer()
                .verify(dto.password().toCharArray(), user.getPassword())
                .verified;

        if (!matches) {
            return new LoginResponseDTO(false, PASSWORD_NOT_FOUND, null, null, null, null, null, null);
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole() == UserRole.ADMIN,
                user.getId()
        );

        return new LoginResponseDTO(
                true,
                SUCCESS,
                user.getUsername(),
                user.getRole() == UserRole.ADMIN,
                user.getId(),
                token,
                user.getRole().name(),
                user.getShelterId()
        );
    }
}
