package com.huhurezmarius.worldmap.repository;

import com.huhurezmarius.worldmap.response.NamedZonesResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class NamedZoneRepositoryTests {
    @Autowired
    private NamedZoneRepository namedZoneRepository;
    @Test
    void printAllNamedZones() {
        List<NamedZonesResponse> namedZone =  namedZoneRepository.findByUserId(1L);
//        System.out.println(namedZone.get().getName());
    }
}
