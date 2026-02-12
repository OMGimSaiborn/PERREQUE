package com.example.pets.petproject.application;

import com.example.pets.petproject.domain.model.CreateUserDTO;
import com.example.pets.petproject.domain.model.PasswordUpdatedDTO;
import com.example.pets.petproject.domain.model.UserDTO;
import com.example.pets.petproject.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public UserDTO createUser(@RequestBody CreateUserDTO dto) {
        return userService.createUser(dto);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }

    @GetMapping("/find/{username}")
    public UserDTO findUser(@PathVariable String username) {
        return userService.getByEmail(username);
    }

    @PutMapping("/update/{id}")
    public UserDTO updateData(@PathVariable Integer id, @RequestBody UserDTO dto) {
        return userService.updateUser(id, dto);
    }

    @PutMapping("/update/password/{id}")
    public UserDTO updatePassword(@PathVariable Integer id, @RequestBody PasswordUpdatedDTO dto) {
        return userService.updatePassword(id, dto.newPassword());
    }



}
