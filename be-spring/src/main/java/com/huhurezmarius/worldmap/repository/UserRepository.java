package com.huhurezmarius.worldmap.repository;

import java.util.List;
import java.util.Optional;

import com.huhurezmarius.worldmap.model.User;
import com.huhurezmarius.worldmap.response.UsersInfoResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);


    List<UsersInfoResponse> findBy();
}
