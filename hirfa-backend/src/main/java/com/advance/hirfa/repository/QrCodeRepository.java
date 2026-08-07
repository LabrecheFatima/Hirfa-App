package com.advance.hirfa.repository;

import com.advance.hirfa.domaine.entities.QrCode;
import com.advance.hirfa.domaine.entities.QrCodeStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface QrCodeRepository extends JpaRepository<QrCode, UUID> {
    Optional<QrCode> findByTicketIdAndTicketPurchaseId(UUID ticketId, UUID ticketPurchaseId);

    Optional<QrCode> findByIdAndStatus(UUID id, QrCodeStatusEnum status);
}
