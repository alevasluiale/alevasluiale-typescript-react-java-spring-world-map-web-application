package com.huhurezmarius.worldmap.repository;

import java.util.Optional;

import com.huhurezmarius.worldmap.model.Role;
import com.huhurezmarius.worldmap.model.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleEnum name);
}