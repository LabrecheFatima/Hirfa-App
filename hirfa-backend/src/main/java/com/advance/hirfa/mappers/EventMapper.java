package com.advance.hirfa.mappers;

import com.advance.hirfa.domaine.CreateEventRequest;
import com.advance.hirfa.domaine.CreateTicketTypeRequest;
import com.advance.hirfa.domaine.UpdatedEventRequest;
import com.advance.hirfa.domaine.UpdatedTicketTypeRequest;
import com.advance.hirfa.domaine.dto.*;
import com.advance.hirfa.domaine.entities.Event;
import com.advance.hirfa.domaine.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);

    CreateEventRequest fromDto(CreateEventRequestDto dto);

    CreateEventResponseDto toDto(Event event);

    ListEventTicketTypeResponseDto toListEventTicketTypeDto(TicketType ticketType);

    ListEventResponseDto toListEventResponseDto(Event event);

    GetEventTicketTypeResponseDto toGetEventTicketTypeResponseDto(TicketType ticketType);

    GetEventDetailsResponseDto toGetEventDetailsResponseDto(Event event);

    UpdatedTicketTypeRequest fromDto(UpdateTicketTypeRequestDto dto);

    UpdatedEventRequest fromDto(UpdateEventRequestDto dto);

    UpdateTicketTypeResponseDto toUpdateTicketTypeResponseDto(TicketType ticketType);

    UpdateEventResponseDto toUpdateEventResponseDto(Event event);

    ListPublishedEventResponseDto toListPublishedEventResponseDto(Event event);

    GetPublishedEventDetailsResponseDto toGetPublishedEventDetailsResponseDto(Event event);

    GetPublishedEventTicketTypeResponseDto toGetPublishedEventTicketTypeResponseDto(TicketType ticketType);
}