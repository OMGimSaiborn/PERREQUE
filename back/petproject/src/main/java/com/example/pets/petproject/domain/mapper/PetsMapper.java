package com.example.pets.petproject.domain.mapper;


import com.example.pets.petproject.domain.model.CreatedPetsDTO;
import com.example.pets.petproject.domain.model.PetsDTO;
import com.example.pets.petproject.infraestructure.entity.ImageEntity;
import com.example.pets.petproject.infraestructure.entity.PetsEntity;

import java.util.List;

public class PetsMapper {
    public static PetsDTO toDto(PetsEntity p) {
        List<String> imageUrls = p.getImages() != null
                ? p.getImages().stream().map(ImageEntity::getUrlImage).toList()
                : List.of();

        return  new PetsDTO(
                        p.getPetId(),
                        p.getOwnerId(),
                        p.getName(),
                        p.getSpecies(),
                        p.getBreed(),
                        p.getSex(),
                        p.getColor(),
                        p.getAge(),
                        p.getDescription(),
                        p.getLocation(),
                        p.getStatus(),
                        imageUrls
        );
    }

    public static PetsEntity toEntity(CreatedPetsDTO dto) {
        PetsEntity e = new PetsEntity();

        e.setName(dto.name());
        e.setSpecies(dto.species());
        e.setBreed(dto.breed());
        e.setSex(dto.sex());
        e.setColor(dto.color());
        e.setAge(dto.age());
        e.setDescription(dto.description());
        e.setLocation(dto.location());
        e.setStatus(dto.status());

        return e;
    }
}

