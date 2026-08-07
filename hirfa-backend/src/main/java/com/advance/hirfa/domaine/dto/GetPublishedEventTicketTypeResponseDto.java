package com.advance.hirfa.domaine.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetPublishedEventTicketTypeResponseDto {
    private UUID id;
    private String name;
    private Double price;
    private String description;

}
