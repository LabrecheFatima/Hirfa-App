package com.advance.hirfa.repository;

import com.advance.hirfa.domaine.entities.TicketValidation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ValidateTicketRepository extends JpaRepository<TicketValidation, UUID> {
}
