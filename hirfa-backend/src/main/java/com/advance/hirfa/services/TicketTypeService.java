package com.advance.hirfa.services;

import com.advance.hirfa.domaine.dto.PurchaseTicketResponseDto;
import com.advance.hirfa.domaine.entities.Ticket;

import java.util.UUID;

public interface TicketTypeService {
    PurchaseTicketResponseDto purchaseTicket(UUID userId, UUID ticketTypeId);
}
