package com.huhurezmarius.worldmap.controller;

import com.huhurezmarius.worldmap.model.NamedZone;
import com.huhurezmarius.worldmap.model.Timezone;
import com.huhurezmarius.worldmap.model.User;
import com.huhurezmarius.worldmap.repository.NamedZoneRepository;
import com.huhurezmarius.worldmap.repository.TimezoneRepository;
import com.huhurezmarius.worldmap.repository.UserRepository;
import com.huhurezmarius.worldmap.request.AddTimezoneRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;
import java.util.Set;
import java.util.TimeZone;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/timezones")
public class NamedTimezoneController {

    @Autowired
    private NamedZoneRepository namedZoneRepository;

    @Autowired
    private TimezoneRepository timezoneRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/get")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_USER_MODERATOR') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getTimezonesForUser(@RequestParam("userId") Long userId) {

        return ResponseEntity.ok(namedZoneRepository.findByUserId(userId));
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_USER_MODERATOR') or hasRole('ROLE_ADMIN')")
    @ResponseBody
    public ResponseEntity<?> addNamedTimezoneForUser(@Valid @RequestBody AddTimezoneRequest addTimezoneRequest, @RequestParam(name = "userId") Long userId) {

        if(namedZoneRepository.findByNameAndUserId(addTimezoneRequest.getName(),userId).isPresent()) {
            return ResponseEntity.badRequest().body("Error: A timezone with same name already exists");
        }
        NamedZone newZone = new NamedZone();
        Optional<User> user = userRepository.findById(userId);
        if(user.isPresent()) {
            newZone.setUser(user.get());
        }
        else return ResponseEntity.badRequest().body("Error: User does not exist");

        Optional<Timezone> timezone = timezoneRepository.findByZoneName(addTimezoneRequest.getZoneName());
        if(timezone.isPresent()) {
            newZone.setTimezone(timezone.get());
        }
        else {
            if( Set.of(TimeZone.getAvailableIDs()).contains(addTimezoneRequest.getZoneName()) ) {
                Timezone newTimezone = new Timezone(addTimezoneRequest.getZoneName(),addTimezoneRequest.getGmt());
                timezoneRepository.save(newTimezone);
                newZone.setTimezone(newTimezone);
            }
            else return ResponseEntity.badRequest().body("Timezone does not exist");
        };

        newZone.setName(addTimezoneRequest.getName());

        namedZoneRepository.save(newZone);

        return ResponseEntity.ok("success");
    }

    @PutMapping("/delete")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_USER_MODERATOR') or hasRole('ROLE_ADMIN')")
    @ResponseBody
    public ResponseEntity<?> deleteNamedZoneById(@RequestParam(name="timezoneId") Long namedZoneId) {
        if(namedZoneRepository.existsById(namedZoneId)) {
            namedZoneRepository.deleteById(namedZoneId);
            return ResponseEntity.ok("Named Zone deleted successfully.");
        }
        else return ResponseEntity.badRequest().body("Named Zone does not exist.");
    }

    @PostMapping("/modify")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_USER_MODERATOR') or hasRole('ROLE_ADMIN')")
    @ResponseBody
    public ResponseEntity<?> updateNamedZoneById(@Valid @RequestBody AddTimezoneRequest modifyTimezoneRequest,@RequestParam(name="timezoneId") Long namedZoneId) {
        if(namedZoneRepository.existsById(namedZoneId)) {
            NamedZone tz = namedZoneRepository.getOne(namedZoneId);
            if(modifyTimezoneRequest.getName() != null && !modifyTimezoneRequest.getName().isEmpty()) {
                tz.setName(modifyTimezoneRequest.getName());
            }
            if(modifyTimezoneRequest.getZoneName() != null && !modifyTimezoneRequest.getZoneName().isEmpty()) {
                Optional<Timezone> timezone = timezoneRepository.findByZoneName(modifyTimezoneRequest.getZoneName());
                if(timezone.isPresent())
                {
                    tz.setTimezone(timezone.get());
                }
                else {
                    Timezone newTimezone = new Timezone(modifyTimezoneRequest.getZoneName(), modifyTimezoneRequest.getGmt());
                    timezoneRepository.save(newTimezone);
                    tz.setTimezone(newTimezone);
                }
            }

            namedZoneRepository.save(tz);
            return ResponseEntity.ok("Named Zone deleted successfully.");
        }
        else return ResponseEntity.badRequest().body("Named Zone does not exist.");
    }
}
