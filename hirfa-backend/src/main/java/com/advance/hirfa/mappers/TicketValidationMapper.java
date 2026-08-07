package com.advance.hirfa.mappers;

import com.advance.hirfa.domaine.dto.TicketValidationRequestDto;
import com.advance.hirfa.domaine.dto.TicketValidationResponseDto;
import com.advance.hirfa.domaine.entities.TicketValidation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketValidationMapper {
    @Mapping(target= "ticketId", source= "ticket.id")
    TicketValidationResponseDto toTicketValidationResponseDto(TicketValidation ticketValidation);
}
