package com.advance.hirfa.controllers;

import com.advance.hirfa.domaine.dto.PurchaseTicketResponseDto;
import com.advance.hirfa.services.TicketTypeService;
import com.advance.hirfa.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;


@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/events/{eventId}/ticket-types")
public class TicketTypeController {

    private final TicketTypeService ticketTypeService;

    @PostMapping(path = "/{ticketTypeId}/tickets")
    public ResponseEntity<PurchaseTicketResponseDto> purchaseTicket(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID ticketTypeId)
    {
        UUID userId = JwtUtil.parseUserId(jwt);
        PurchaseTicketResponseDto response = ticketTypeService.purchaseTicket(userId, ticketTypeId);
        return ResponseEntity.ok(response);
    }

    private UUID parseUserId(Jwt jwt) {
        return UUID.fromString(jwt.getSubject());
}}
