package com.advance.hirfa.services.impl;

import com.advance.hirfa.domaine.dto.ChargilyCheckoutRequestDto;
import com.advance.hirfa.domaine.dto.ChargilyCheckoutResponseDto;
import com.advance.hirfa.services.ChargilyPayService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.UUID;

@Service
public class ChargilyPayServiceImpl implements ChargilyPayService{

    private final RestClient restClient;
    private final String apiKey;
    private final String baseUrl;
    private final String successUrl;
    private final String failureUrl;

    public ChargilyPayServiceImpl(
            @Value("${chargily.pay.api-key}") String apiKey,
            @Value("${chargily.pay.base-url}") String baseUrl,
            @Value("${chargily.pay.success-url}") String successUrl,
            @Value("${chargily.pay.failure-url}") String failureUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.successUrl = successUrl;
        this.failureUrl = failureUrl;
        this.restClient = RestClient.builder().build();
    }


    @Override
    public ChargilyCheckoutResponseDto createCheckoutSession(UUID ticketId, double amount, String userEmail) {
        ChargilyCheckoutRequestDto request = ChargilyCheckoutRequestDto.builder()
                .amount(amount)
                .currency("dzd")
                .successUrl(successUrl)
                .failureUrl(failureUrl)
                .metadata(Map.of(
                        "ticket_id", ticketId.toString(),
                        "user_email", userEmail
                ))
                .build();

        return restClient.post()
                .uri(baseUrl + "/checkouts")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(ChargilyCheckoutResponseDto.class);
    }
}
