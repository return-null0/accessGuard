package com.renaldo.accessguard.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/videos")
@CrossOrigin(origins = "http://localhost:4200") 

public class VideoController {

    private static final String VIDEO_DIRECTORY = "/var/www/cdn";

    @GetMapping
    public List<String> listVideos() {
        File folder = new File(VIDEO_DIRECTORY);
        File[] files = folder.listFiles();

        if (files == null) {
            return List.of();
        }

        return Arrays.stream(files)
                .filter(File::isFile)
                .map(file -> "http://localhost:42069/files/" + file.getName())
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('admin')")
    @CrossOrigin(origins = "http://localhost:4200") 
    @PostMapping("/upload")
    public ResponseEntity<String> uploadVideo(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            Path path = Paths.get(VIDEO_DIRECTORY + File.separator + file.getOriginalFilename());
            Files.write(path, file.getBytes());
            return ResponseEntity.ok("File uploaded successfully: " + file.getOriginalFilename());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not upload file");
        }
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{filename}")
    public ResponseEntity<String> deleteVideo(@PathVariable String filename) {
        File file = new File(VIDEO_DIRECTORY + File.separator + filename);

        if (file.exists() && file.delete()) {
            return ResponseEntity.ok("Deleted " + filename);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found or could not be deleted");
        }
    }
}