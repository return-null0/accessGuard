package com.renaldo.accessguard.controller;

import com.renaldo.accessguard.entity.UserPermission;
import com.renaldo.accessguard.repository.UserPermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/permissions")
@CrossOrigin(origins = "http://localhost:4200") 

public class PermissionController {

    private final UserPermissionRepository permissionRepository;

    @Autowired
    public PermissionController(UserPermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @GetMapping("/user/{userId}")

    @PreAuthorize("isAuthenticated()") 
    public ResponseEntity<UserPermission> getUserPermissions(@PathVariable Long userId) {

        return permissionRepository.findByUser_Id(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {

                    return ResponseEntity.notFound().build();
                });
    }
}