package com.advance.hirfa.services.impl;

import com.advance.hirfa.domaine.dto.ChargilyCheckoutResponseDto;
import com.advance.hirfa.domaine.dto.PurchaseTicketResponseDto;
import com.advance.hirfa.domaine.entities.Ticket;
import com.advance.hirfa.domaine.entities.TicketStatusEnum;
import com.advance.hirfa.domaine.entities.TicketType;
import com.advance.hirfa.domaine.entities.User;
import com.advance.hirfa.exceptions.TicketSoldOutExceptions;
import com.advance.hirfa.exceptions.TicketTypeNotFoundExceptions;
import com.advance.hirfa.exceptions.UserNotFoundExceptions;
import com.advance.hirfa.repository.TicketRepository;
import com.advance.hirfa.repository.TicketTypeRepository;
import com.advance.hirfa.repository.UserRepository;
import com.advance.hirfa.services.ChargilyPayService;
import com.advance.hirfa.services.QrCodeService;
import com.advance.hirfa.services.TicketTypeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {

    private final UserRepository userRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final TicketRepository ticketRepository;
    private final QrCodeService qrCodeService;
    private final ChargilyPayService chargilyPayService;

    @Override
    @Transactional
    public PurchaseTicketResponseDto purchaseTicket(UUID userId, UUID ticketTypeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundExceptions(
                        String.format("User with ID %s was not found", userId)
                ));

        TicketType ticketType = ticketTypeRepository.findByIdWithLock(ticketTypeId)
                .orElseThrow(() -> new TicketTypeNotFoundExceptions(
                        String.format("Ticket type with ID %s was not found", ticketTypeId)
                ));

        Integer totalAvailable = ticketType.getTotalAvailable();

        if (totalAvailable <= 0) {
            throw new TicketSoldOutExceptions("No more tickets available for this tier!");
        }

        ticketType.setTotalAvailable(totalAvailable - 1);

        ticketTypeRepository.save(ticketType);

        Ticket ticket = Ticket.builder()
                .purchase(user)
                .ticketType(ticketType)
                .status(TicketStatusEnum.PURCHASED)
                .createAt(LocalDateTime.now())
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);

        qrCodeService.generateQrCode(savedTicket);

        ChargilyCheckoutResponseDto checkout = chargilyPayService.createCheckoutSession(
                savedTicket.getId(),
                ticketType.getPrice(),
                user.getEmail()
        );

        savedTicket.setChargilyCheckoutId(checkout.getId());
        ticketRepository.save(savedTicket);

        return PurchaseTicketResponseDto.builder()
                .ticketId(savedTicket.getId())
                .checkoutUrl(checkout.getCheckoutUrl())
                .build();}


}
