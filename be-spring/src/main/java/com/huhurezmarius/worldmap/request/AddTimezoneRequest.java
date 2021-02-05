package com.huhurezmarius.worldmap.request;

public class AddTimezoneRequest {
    private Long id;
    private String name;
    private String zoneName;
    private String gmt;
    public AddTimezoneRequest(String name, String zoneName) {
        this.name = name;
        this.zoneName = zoneName;
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

    public String getName() {
        return name;
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
}
