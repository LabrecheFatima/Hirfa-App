package com.advance.hirfa.domaine.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChargilyCheckoutResponseDto {
    private String id;
    private String status;

    @JsonProperty("checkout_url")
    private String checkoutUrl;
}
