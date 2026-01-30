package com.renaldo.accessguard.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        System.out.println("--- JWT FILTER: Processing Request to " + request.getRequestURI() + " ---");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("--- JWT FILTER: No Bearer header found. Passing to next filter. ---");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {

            userEmail = jwtService.extractUsername(jwt);
            System.out.println("--- JWT FILTER: User Email Extracted: " + userEmail + " ---");

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                boolean isValid = jwtService.isTokenValid(jwt, userDetails);
                System.out.println("--- JWT FILTER: Is Token Valid? " + isValid + " ---");

                if (isValid) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("--- JWT FILTER: Authentication set in Context! ---");
                }
            }
        } catch (Exception e) {

            System.out.println("--- JWT FILTER ERROR: " + e.getMessage());
            e.printStackTrace(); 

        }

        filterChain.doFilter(request, response);
    }
}