package com.huhurezmarius.worldmap.repository;


import com.huhurezmarius.worldmap.model.NamedZone;
import com.huhurezmarius.worldmap.response.NamedZonesResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NamedZoneRepository extends JpaRepository<NamedZone, Long> {
    @Query("select new com.toptal.timezones.response.NamedZonesResponse(nz.id,nz.name,tz.zoneName,tz.gmt) from NamedZone nz\n" +
            "left join Timezone tz on nz.timezone.id=tz.id\n" +
            "where nz.user.id = :user_id")
    List<NamedZonesResponse> findByUserId(Long user_id);

    Optional<NamedZone> findByName(String name);

    Optional<NamedZone> findByNameAndUserId(String name,Long userId);
}