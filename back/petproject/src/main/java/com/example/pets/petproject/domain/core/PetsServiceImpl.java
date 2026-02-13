package com.example.pets.petproject.domain.core;

import com.example.pets.petproject.domain.mapper.PetsMapper;
import com.example.pets.petproject.domain.model.CreatedPetsDTO;
import com.example.pets.petproject.domain.model.PetsDTO;
import com.example.pets.petproject.domain.port.PetsRepositoryDB;
import com.example.pets.petproject.domain.service.PetsService;
import com.example.pets.petproject.infraestructure.entity.PetsEntity;
import com.example.pets.petproject.utils.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<PetsDTO> getAllPets() {
        return repository.findAll()
                .stream()
                .map(PetsMapper::toDto)
                .toList();
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




}
