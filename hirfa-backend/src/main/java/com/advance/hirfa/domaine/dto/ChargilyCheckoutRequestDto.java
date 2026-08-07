package com.advance.hirfa.domaine.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChargilyCheckoutRequestDto {
    private double amount;
    private String currency;

    @JsonProperty("success_url")
    private String successUrl;

    @JsonProperty("failure_url")
    private String failureUrl;

    private Map<String, Object> metadata;
}
