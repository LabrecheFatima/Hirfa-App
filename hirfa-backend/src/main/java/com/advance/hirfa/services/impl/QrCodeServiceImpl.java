package com.advance.hirfa.services.impl;

import com.advance.hirfa.domaine.entities.QrCode;
import com.advance.hirfa.domaine.entities.QrCodeStatusEnum;
import com.advance.hirfa.domaine.entities.Ticket;
import com.advance.hirfa.exceptions.QrCodeNotFoundExceptions;
import com.advance.hirfa.repository.QrCodeRepository;
import com.advance.hirfa.repository.TicketRepository;
import com.advance.hirfa.services.QrCodeService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.UUID;

import java.io.ByteArrayOutputStream;
import javax.imageio.ImageIO;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class QrCodeServiceImpl implements QrCodeService {

    private static final int QR_WIDTH = 300;
    private static final int QR_HEIGHT = 300;

    private final QRCodeWriter qrCodeWriter;
    private final QrCodeRepository qrCodeRepository;
    private final TicketRepository ticketRepository;

    @Override
    public QrCode generateQrCode(Ticket ticket) {
        try {
            UUID uniqueId = UUID.randomUUID();
            String base64Image = generateQrCodeImage(uniqueId);

            QrCode qrCode = QrCode.builder()
                    .id(uniqueId)
                    .value(base64Image)
                    .status(QrCodeStatusEnum.ACTIVE) // Set appropriate default status enum value
                    .ticket(ticket)
                    .build();

            return qrCodeRepository.saveAndFlush( qrCode);
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR code for ticket", e);
        }
    }

    @Override
    @Transactional
    public byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId) {
        QrCode qrCode = qrCodeRepository.findByTicketIdAndTicketPurchaseId(ticketId, userId)
                .orElseGet(() -> {
                    Ticket ticket = ticketRepository.findByIdAndPurchaseId(ticketId, userId)
                            .orElseThrow(QrCodeNotFoundExceptions::new);

                    return generateQrCode(ticket);
                });
        try {
            return Base64.getDecoder().decode(qrCode.getValue());
        } catch (IllegalArgumentException ex) {
            log.error("Invalid base64 QR Code for ticket ID: {}", ticketId, ex);
            throw new QrCodeNotFoundExceptions();
        }
    }

    private String generateQrCodeImage(UUID uniqueId) throws WriterException, IOException {
        BitMatrix bitMatrix = qrCodeWriter.encode(
                uniqueId.toString(),
                BarcodeFormat.QR_CODE,
                QR_WIDTH,
                QR_HEIGHT
        );

        BufferedImage qrCodeImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            ImageIO.write(qrCodeImage, "PNG", baos);
            byte[] imageBytes = baos.toByteArray();

            return Base64.getEncoder().encodeToString(imageBytes);
        }
    }
}