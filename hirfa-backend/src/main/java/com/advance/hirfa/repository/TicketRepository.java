package com.advance.hirfa.repository;

import com.advance.hirfa.domaine.entities.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    int countByTicketTypeId(UUID ticketTypeId);

    Page<Ticket> findByPurchaseId(UUID purchaserId, Pageable pageable);

    Optional<Ticket> findByIdAndPurchaseId(UUID id, UUID purchaseId);

    Optional<Ticket> findByChargilyCheckoutId(String chargilyCheckoutId);
}
