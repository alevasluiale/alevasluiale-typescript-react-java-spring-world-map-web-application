package com.huhurezmarius.worldmap.response;

public class NamedZonesResponse {
    private String name;
    private String zoneName;
    private String gmt;
    private Long id;
    public NamedZonesResponse(Long id,String name, String zoneName, String gmt) {
        this.name = name;
        this.zoneName = zoneName;
        this.gmt = gmt;
        this.id= id;
    }

    public String getName() {
        return name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getZoneName() {
        return zoneName;
    }

    public void setZoneName(String zoneName) {
        this.zoneName = zoneName;
    }

    public String getGmt() {
        return gmt;
    }

    public void setGmt(String gmt) {
        this.gmt = gmt;
    }
}
