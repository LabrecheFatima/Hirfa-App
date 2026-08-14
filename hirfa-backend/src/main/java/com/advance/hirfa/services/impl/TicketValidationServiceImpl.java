package com.advance.hirfa.services.impl;

import com.advance.hirfa.domaine.entities.*;
import com.advance.hirfa.exceptions.QrCodeNotFoundExceptions;
import com.advance.hirfa.exceptions.TicketNotFoundExceptions;
import com.advance.hirfa.repository.QrCodeRepository;
import com.advance.hirfa.repository.TicketRepository;
import com.advance.hirfa.repository.ValidateTicketRepository;
import com.advance.hirfa.services.TicketValidationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketValidationServiceImpl implements TicketValidationService {

    private final QrCodeRepository qrCodeRepository;
    private final TicketRepository ticketRepository;
    private final ValidateTicketRepository ticketValidationRepository;

    @Override
    public TicketValidation validateTicketByQroCode(UUID qrCodeId) {
        QrCode qrCode = qrCodeRepository.findById(qrCodeId)
                .orElseThrow(() -> new QrCodeNotFoundExceptions(
                        String.format("QR Code with ID %s was not found", qrCodeId)
                ));
        
        if (qrCode.getTicket() == null) {
            throw new TicketNotFoundExceptions("No valid ticket associated with this QR Code.");
        }

        return validateTicket(qrCode.getTicket(), TicketValidationMethod.QR_SCAN);
    }

    @Override
    public TicketValidation validateTicketManually(UUID ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(TicketNotFoundExceptions::new);

        return validateTicket(ticket, TicketValidationMethod.MANUAL);
    }

    private TicketValidation validateTicket(Ticket ticket, TicketValidationMethod validationMethod) {
        // Always set status to VALID and persist every scan event in PostgreSQL.
        TicketValidation ticketValidation = TicketValidation.builder()
                .ticket(ticket)
                .validationMethod(validationMethod)
                .status(TicketValidationEnum.VALID)
                .build();

        return ticketValidationRepository.save(ticketValidation);
    }
}