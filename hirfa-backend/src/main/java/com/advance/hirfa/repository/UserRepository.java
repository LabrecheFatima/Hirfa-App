package com.advance.hirfa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.advance.hirfa.domaine.entities.User;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
}
