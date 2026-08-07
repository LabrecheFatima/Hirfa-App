package com.advance.hirfa.services;

import com.advance.hirfa.domaine.dto.ChargilyCheckoutResponseDto;

import java.util.UUID;

public interface ChargilyPayService {
    ChargilyCheckoutResponseDto createCheckoutSession(UUID ticketId, double amount, String userEmail);
}
