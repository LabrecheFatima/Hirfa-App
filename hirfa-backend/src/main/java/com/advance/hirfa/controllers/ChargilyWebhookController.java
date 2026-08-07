package com.advance.hirfa.controllers;

import com.advance.hirfa.domaine.entities.Ticket;
import com.advance.hirfa.domaine.entities.TicketStatusEnum;
import com.advance.hirfa.repository.TicketRepository;
import com.advance.hirfa.services.QrCodeService;
import com.advance.hirfa.util.HmacUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments/chargily")
@RequiredArgsConstructor
@Slf4j
public class ChargilyWebhookController {

    private final TicketRepository ticketRepository;
    private final QrCodeService qrCodeService;
    private final ObjectMapper objectMapper;

    @Value("${chargily.pay.webhook-secret}")
    private String webhookSecret;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestHeader(value = "signature", required = false) String signature,
            @RequestBody String rawPayload) {

        log.info("Received Chargily Webhook notification");

        // 1. Verify HMAC-SHA256 signature
        if (!HmacUtil.verifySignature(rawPayload, signature, webhookSecret)) {
            log.warn("Invalid webhook signature received");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid signature");
        }

        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            String eventType = root.has("type") ? root.get("type").asText() : root.path("event").asText();
            JsonNode dataNode = root.path("data");

            if ("checkout.paid".equalsIgnoreCase(eventType)) {
                String checkoutId = dataNode.path("id").asText();
                JsonNode metadata = dataNode.path("metadata");

                Optional<Ticket> ticketOpt = Optional.empty();

                // Locate ticket via metadata ticket_id or fallback to chargilyCheckoutId
                if (metadata.has("ticket_id")) {
                    UUID ticketId = UUID.fromString(metadata.get("ticket_id").asText());
                    ticketOpt = ticketRepository.findById(ticketId);
                }
                if (ticketOpt.isEmpty() && !checkoutId.isBlank()) {
                    ticketOpt = ticketRepository.findByChargilyCheckoutId(checkoutId);
                }

                if (ticketOpt.isPresent()) {
                    Ticket ticket = ticketOpt.get();

                    // Idempotency check: Skip if already processed
                    if (ticket.getStatus() == TicketStatusEnum.PURCHASED) {
                        log.info("Ticket {} already marked as PURCHASED", ticket.getId());
                        return ResponseEntity.ok("Already processed");
                    }

                    // Mark as PURCHASED and generate QR Code
                    ticket.setStatus(TicketStatusEnum.PURCHASED);
                    Ticket savedTicket = ticketRepository.save(ticket);
                    qrCodeService.generateQrCode(savedTicket);

                    log.info("Successfully completed payment for Ticket ID {}", ticket.getId());
                } else {
                    log.warn("Ticket matching Chargily checkout ID {} was not found", checkoutId);
                }
            } else if ("checkout.failed".equalsIgnoreCase(eventType) || "checkout.canceled".equalsIgnoreCase(eventType)) {
                String checkoutId = dataNode.path("id").asText();
                ticketRepository.findByChargilyCheckoutId(checkoutId).ifPresent(ticket -> {
                    ticket.setStatus(TicketStatusEnum.PAYMENT_FAILED);
                    ticketRepository.save(ticket);
                    log.info("Marked Ticket ID {} as PAYMENT_FAILED", ticket.getId());
                });
            }

            return ResponseEntity.ok("Webhook processed successfully");
        } catch (Exception e) {
            log.error("Error processing Chargily webhook payload", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid JSON payload");
        }
    }
}
