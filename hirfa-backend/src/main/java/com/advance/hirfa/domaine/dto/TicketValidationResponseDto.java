package com.advance.hirfa.domaine.dto;

import com.advance.hirfa.domaine.entities.TicketValidationEnum;
import com.advance.hirfa.domaine.entities.TicketValidationMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketValidationResponseDto {
    private UUID ticketId;
    private TicketValidationEnum status;

}
