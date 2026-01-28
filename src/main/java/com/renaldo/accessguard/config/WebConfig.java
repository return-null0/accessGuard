package com.renaldo.accessguard.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map URL path "/files/**" to the Docker volume path "/var/www/cdn/"
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:/var/www/cdn/");
    }
}