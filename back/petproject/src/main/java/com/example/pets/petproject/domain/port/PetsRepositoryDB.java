package com.example.pets.petproject.domain.port;

import com.example.pets.petproject.infraestructure.entity.PetsEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PetsRepositoryDB extends JpaRepository<PetsEntity, Integer> {
    Page<PetsEntity> findByShelterId(Integer shelterId, Pageable pageable);
}
