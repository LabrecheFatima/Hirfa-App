package com.advance.hirfa.mappers;

import com.advance.hirfa.domaine.dto.GetTicketResponseDto;
import com.advance.hirfa.domaine.dto.ListTicketResponseDto;
import com.advance.hirfa.domaine.dto.ListTicketTypeResponseDto;
import com.advance.hirfa.domaine.entities.Ticket;
import com.advance.hirfa.domaine.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketMapper {
    ListTicketTypeResponseDto toListTicketTypeResponseDto(TicketType ticketType);

    ListTicketResponseDto toListTicketResponseDto(Ticket ticket);

    @Mapping(target = "price", source = "ticketType.price")
    @Mapping(target = "description", source = "ticketType.description")
    @Mapping(target = "eventName", source = "ticketType.event.name")
    @Mapping(target = "eventVenue", source = "ticketType.event.venue")
    @Mapping(target = "eventStart", source = "ticketType.event.start")
    @Mapping(target = "eventEnd", source = "ticketType.event.end")
    GetTicketResponseDto toGetTicketResponseDto(Ticket ticket);
}
