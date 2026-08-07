package com.advance.hirfa.services;

import com.advance.hirfa.domaine.entities.QrCode;
import com.advance.hirfa.domaine.entities.Ticket;

import java.util.UUID;

public interface QrCodeService {
    QrCode generateQrCode(Ticket ticket);

    byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId);
}
