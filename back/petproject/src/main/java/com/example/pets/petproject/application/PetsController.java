package com.example.pets.petproject.application;

import com.example.pets.petproject.domain.model.CreatedPetsDTO;
import com.example.pets.petproject.domain.model.PetsDTO;
import com.example.pets.petproject.domain.model.UserDTO;
import com.example.pets.petproject.domain.port.PetsRepositoryDB;
import com.example.pets.petproject.domain.service.PetsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
@CrossOrigin
public class PetsController {

    @Autowired
    private PetsService petsService;

    @GetMapping
    public Page<PetsDTO> getAllPets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return petsService.getAllPets(page, size);
    }

    @GetMapping("/details/{id}")
    public PetsDTO getPetById(@PathVariable Integer id) {
        return petsService.getPetById(id);
    }

    @PostMapping
    public PetsDTO createPet(@RequestBody CreatedPetsDTO dto) {
        return petsService.createPet(dto);
    }

    @PutMapping("/updatePet/{id}")
    public PetsDTO updateData(@PathVariable Integer id, @RequestBody PetsDTO dto) {
        return petsService.updatePet(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletePet(@PathVariable Integer id) {
        petsService.deleteById(id);
    }

    @GetMapping("/shelter/{shelterId}")
    public Page<PetsDTO> getPetsByShelter(
            @PathVariable Integer shelterId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return petsService.getPetsByShelter(shelterId, page, size);
    }
}
