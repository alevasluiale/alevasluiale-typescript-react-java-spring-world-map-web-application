package com.huhurezmarius.worldmap.controller;

import com.huhurezmarius.worldmap.model.User;
import com.huhurezmarius.worldmap.repository.UserRepository;
import com.huhurezmarius.worldmap.request.SignupRequest;
import com.huhurezmarius.worldmap.request.UpdateUserRequest;
import com.huhurezmarius.worldmap.response.MessageResponse;
import com.huhurezmarius.worldmap.response.UsersInfoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;


    @GetMapping("/getAll")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER_MANAGER')")
    public List<UsersInfoResponse> getAllUsers() {
        return userRepository.findBy();
    }
    @PostMapping("/addUser")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER_MANAGER')")
    public ResponseEntity<?> addUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));


        user.setRoles(user.getRolesFromString(signUpRequest.getRole()));

        userRepository.save(user);

        return ResponseEntity.ok("User added successfully");
    }

    @PutMapping("/deleteUser")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER_MANAGER')")
    @ResponseBody
    public ResponseEntity<?> deleteUser(@RequestParam(name="userId") Long userId) {
        if(userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return ResponseEntity.ok("User deleted successfully.");
        }
        else return ResponseEntity.badRequest().body("User does not exist.");
    }

    @PostMapping("/updateUser")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER_MANAGER')")
    @ResponseBody
    public ResponseEntity<?> updateUser(@Valid @RequestBody UpdateUserRequest updateUserRequest) {
        Optional<User> user = userRepository.findById(updateUserRequest.getId());

        if(user.isPresent())
        {
            User newUser = user.get();
            if(updateUserRequest.getRole() != null) {
                newUser.setRoles(newUser.getRolesFromString(updateUserRequest.getRole()));
            }
            if(updateUserRequest.getEmail() != null) {
                newUser.setEmail(updateUserRequest.getEmail());
            }
            if(updateUserRequest.getPassword() != null && !updateUserRequest.getPassword().isBlank() && !updateUserRequest.getPassword().isEmpty() ) {
                if(updateUserRequest.getPassword().length()<6) {
                    return ResponseEntity.badRequest().body("Password has length less than 6.");
                }
                newUser.setPassword(encoder.encode(updateUserRequest.getPassword()));
            }
            if(updateUserRequest.getUsername() != null) {
                newUser.setUsername(updateUserRequest.getUsername());
            }

            userRepository.save(newUser);
            return ResponseEntity.ok("User updated successfully");
        }
        else return ResponseEntity.badRequest().body("User does not exist.");
    }
}
