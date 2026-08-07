package com.advance.hirfa.controllers;

import com.advance.hirfa.domaine.dto.TicketValidationRequestDto;
import com.advance.hirfa.domaine.dto.TicketValidationResponseDto;
import com.advance.hirfa.domaine.entities.TicketValidation;
import com.advance.hirfa.domaine.entities.TicketValidationMethod;
import com.advance.hirfa.mappers.TicketValidationMapper;
import com.advance.hirfa.services.TicketValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(path= "/api/v1/ticket-validations")
public class TicketValidationController {
    private final TicketValidationService ticketValidationService;
    private final TicketValidationMapper ticketValidationMapper;

    @PostMapping
    public ResponseEntity<TicketValidationResponseDto> validateTicket(
            @RequestBody TicketValidationRequestDto ticketValidationRequestDto

    ) {
        TicketValidationMethod method = ticketValidationRequestDto.getMethod();
        TicketValidation ticketValidation;

        if (TicketValidationMethod.MANUAL.equals(method)) {
            ticketValidation = ticketValidationService.validateTicketManually(
                    ticketValidationRequestDto.getId()
            );
        } else {

            ticketValidation = ticketValidationService.validateTicketByQroCode(
                    ticketValidationRequestDto.getId()
            );
        }

        return ResponseEntity.ok(
                ticketValidationMapper.toTicketValidationResponseDto(ticketValidation)
        );
        }
}
