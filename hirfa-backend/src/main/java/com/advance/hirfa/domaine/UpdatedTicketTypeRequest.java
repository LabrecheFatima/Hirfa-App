package com.advance.hirfa.domaine;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdatedTicketTypeRequest {
    private UUID id;
    private String name;
    private Double price;
    private String description;
    private Integer totalAvailable;
}
