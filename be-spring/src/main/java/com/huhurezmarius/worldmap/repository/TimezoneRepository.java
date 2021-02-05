package com.huhurezmarius.worldmap.repository;

import com.huhurezmarius.worldmap.model.Timezone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TimezoneRepository extends JpaRepository<Timezone,Long> {
    Optional<Timezone> findByZoneName(String zoneName);

    Boolean existsByZoneName(String zoneName);
}
