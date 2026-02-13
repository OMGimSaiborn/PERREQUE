package com.example.pets.petproject.domain.model;

import com.example.pets.petproject.domain.enums.PetSex;
import com.example.pets.petproject.domain.enums.PetSpecies;
import com.example.pets.petproject.domain.enums.PetStatus;

import java.time.LocalDateTime;

public record CreatedPetsDTO(
    String name,
    PetSpecies species,
    String breed,
    PetSex sex,
    String color,
    Integer age,
    String description,
    String location,
    PetStatus status
    ) {

}
