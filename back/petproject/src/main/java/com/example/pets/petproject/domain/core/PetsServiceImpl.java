package com.example.pets.petproject.domain.core;

import com.example.pets.petproject.domain.enums.PetStatus;
import com.example.pets.petproject.domain.mapper.PetsMapper;
import com.example.pets.petproject.domain.mapper.UserMapper;
import com.example.pets.petproject.domain.model.CreatedPetsDTO;
import com.example.pets.petproject.domain.model.PetsDTO;
import com.example.pets.petproject.domain.model.UserDTO;
import com.example.pets.petproject.domain.port.PetsRepositoryDB;
import com.example.pets.petproject.domain.service.PetsService;
import com.example.pets.petproject.infraestructure.entity.PetsEntity;
import com.example.pets.petproject.infraestructure.entity.UserEntity;
import com.example.pets.petproject.utils.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class PetsServiceImpl implements PetsService {

    private final PetsRepositoryDB repository;

    public PetsServiceImpl(PetsRepositoryDB repository) {
        this.repository = repository;
    }

    @Override
    public Page<PetsDTO> getAllPets(int page, int size, PetStatus status) {
        Pageable pageable = PageRequest.of(page, size);

        if (status != null) {
            return repository.findByStatus(status, pageable).map(PetsMapper::toDto);
        }

        return repository.findAll(pageable).map(PetsMapper::toDto);
    }

    @Override
    public PetsDTO createPet(CreatedPetsDTO dto) {
        PetsEntity entity = PetsMapper.toEntity(dto);

        PetsEntity saved = repository.save(entity);
        return PetsMapper.toDto(saved);
    }

    @Override
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public PetsDTO getPetById(Integer id) {
        try{
            Optional<PetsEntity> pet = repository.findById(id);

            if(pet.isEmpty()){
                throw new RuntimeException(Constants.PET_NOT_FOUND);
            }

            return PetsMapper.toDto(pet.get());
        } catch(Exception e){
            throw new RuntimeException(Constants.PET_NOT_FOUND);
        }
    }

    @Override
    public PetsDTO updatePet(Integer id, PetsDTO dto) {
        PetsEntity existing = repository.findById(id).orElseThrow(
                () -> new RuntimeException("Mascota no encontrada")
        );

        existing.setName(dto.name());
        existing.setAge(dto.age());
        existing.setColor(dto.color());
        existing.setBreed(dto.breed());
        existing.setDescription(dto.description());
        existing.setLocation(dto.location());
        existing.setStatus(dto.status());

        PetsEntity updated = repository.save(existing);
        return PetsMapper.toDto(updated);
    }




}
