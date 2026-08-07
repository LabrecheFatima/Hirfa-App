package com.advance.hirfa.domaine.dto;

import com.advance.hirfa.domaine.entities.TicketStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListTicketResponseDto {
    private UUID id;
    private TicketStatusEnum status;
    private ListTicketTypeResponseDto ticketType;
}
