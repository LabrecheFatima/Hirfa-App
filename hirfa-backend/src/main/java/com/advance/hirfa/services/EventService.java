package com.advance.hirfa.services;

import com.advance.hirfa.domaine.CreateEventRequest;
import com.advance.hirfa.domaine.UpdatedEventRequest;
import com.advance.hirfa.domaine.entities.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.Optional;
import java.util.UUID;

public interface EventService {
    Event createEvent(UUID organizerId, CreateEventRequest event);

    Page<Event> listEventsForOrganizer(UUID organizerId, Pageable pageable);

    Optional<Event> getEventForOrganizer(UUID organizerID, UUID id);

    Event updateEventForOrganizer(UUID organizerId, UUID id, UpdatedEventRequest event);

    void deleteEventForOrganizer(UUID organizerId, UUID id);

    Page<Event> listPublishedEvent(Pageable pageable);

    Page<Event> searchPublishedEvents(String query, Pageable pageable);

    Optional<Event> getPublishedEvent(UUID id);
}
