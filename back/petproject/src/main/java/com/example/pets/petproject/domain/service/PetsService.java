package com.example.pets.petproject.domain.service;

import com.example.pets.petproject.domain.model.CreatedPetsDTO;
import com.example.pets.petproject.domain.model.PetsDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PetsService {

    Page<PetsDTO> getAllPets(int page, int size);

    PetsDTO getPetById(Integer id);

    PetsDTO createPet(CreatedPetsDTO dto);

    PetsDTO updatePet(Integer id, PetsDTO dto);

    void deleteById(Integer id);

    Page<PetsDTO> getPetsByShelter(Integer shelterId, int page, int size);


}
