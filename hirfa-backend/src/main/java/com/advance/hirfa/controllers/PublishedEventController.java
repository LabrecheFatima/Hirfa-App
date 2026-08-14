package com.advance.hirfa.controllers;

import com.advance.hirfa.domaine.dto.GetPublishedEventDetailsResponseDto;
import com.advance.hirfa.domaine.dto.ListPublishedEventResponseDto;
import com.advance.hirfa.domaine.entities.Event;
import com.advance.hirfa.mappers.EventMapper;
import com.advance.hirfa.services.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/published-events")
@RequiredArgsConstructor
public class PublishedEventController {

    private final EventService eventService;
    private final EventMapper eventMapper;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<Page<ListPublishedEventResponseDto>> listPublishedEvents(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String query,
            Pageable pageable) {

        String searchTerm = (q != null && !q.trim().isEmpty()) ? q : query;

        Page<Event> events;
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            events = eventService.searchPublishedEvents(searchTerm, pageable);
        } else {
            events = eventService.listPublishedEvent(pageable);
        }

        return ResponseEntity.ok(events.map(eventMapper::toListPublishedEventResponseDto));
    }

    @GetMapping(path = "/{eventId}")
    @Transactional(readOnly = true)
    public ResponseEntity<GetPublishedEventDetailsResponseDto> getPublishedEventDetails(
            @PathVariable UUID eventId
    ) {
        return eventService.getPublishedEvent(eventId)
                .map(eventMapper::toGetPublishedEventDetailsResponseDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}