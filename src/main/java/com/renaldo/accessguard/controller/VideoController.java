package com.renaldo.accessguard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/videos")
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
                .map(file -> "http://localhost:8081/files/" + file.getName())
                .collect(Collectors.toList());
    }
}