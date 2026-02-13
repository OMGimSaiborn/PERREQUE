package com.example.pets.petproject.domain.model;

import com.example.pets.petproject.domain.enums.PetSex;
import com.example.pets.petproject.domain.enums.PetSpecies;
import com.example.pets.petproject.domain.enums.PetStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

public record PetsDTO (
    Integer petId,
    Integer ownerId,
    String name,
    PetSpecies species,
    String breed,
    PetSex sex,
    String color,
    Integer age,
    String description,
    String location,
    PetStatus status,
    List<String> images
    ) {

}
