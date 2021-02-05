package com.huhurezmarius.worldmap.response;

import com.huhurezmarius.worldmap.model.Role;

import java.util.Set;

public interface UsersInfoResponse {
    Long getId();
    String getUsername();
    String getEmail();
    Set<Role> getRoles();
}
