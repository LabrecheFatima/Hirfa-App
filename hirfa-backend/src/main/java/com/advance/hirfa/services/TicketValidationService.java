package com.advance.hirfa.services;

import com.advance.hirfa.domaine.entities.TicketValidation;

import java.util.UUID;

public interface TicketValidationService {
    TicketValidation validateTicketByQroCode(UUID qrCodeId);
    TicketValidation validateTicketManually(UUID ticketId);
}
