package com.renaldo.accessguard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.renaldo.accessguard.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}