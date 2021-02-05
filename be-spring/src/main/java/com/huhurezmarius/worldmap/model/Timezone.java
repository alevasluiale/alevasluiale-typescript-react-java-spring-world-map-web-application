package com.huhurezmarius.worldmap.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

@Entity
@Table(	name = "time_zones",
        uniqueConstraints = @UniqueConstraint(columnNames = "zone_name")
        )
public class Timezone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    @Size(max = 100)
    @Column(name="zone_name")
    private String zoneName;

    @NotBlank
    @Size(max = 150)
    private String gmt;

    @OneToMany(mappedBy = "timezone")
    private Set<NamedZone> namedZone;


    public Timezone() {

    }

    public Timezone(String zoneName,String gmt) {
        this.zoneName = zoneName;
        this.gmt = gmt;
    }

    public Set<NamedZone> getNamedZone() {
        return namedZone;
    }

    public void setNamedZone(Set<NamedZone> namedZone) {
        this.namedZone = namedZone;
    }

    public String getGmt() {
        return gmt;
    }

    public void setGmt(String gmt) {
        this.gmt = gmt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getZoneName() {
        return zoneName;
    }

    public void setZoneName(String zoneName) {
        this.zoneName = zoneName;
    }
}

