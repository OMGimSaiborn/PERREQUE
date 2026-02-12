package com.example.pets.petproject.domain.service;

import com.example.pets.petproject.domain.model.CreatedPetsDTO;
import com.example.pets.petproject.domain.model.PetsDTO;

import java.util.List;

public interface PetsService {

    List<PetsDTO> getAllPets();

    PetsDTO getPetById(Integer id);

    PetsDTO createPet(CreatedPetsDTO dto);

    void deleteById(Integer id);


}
