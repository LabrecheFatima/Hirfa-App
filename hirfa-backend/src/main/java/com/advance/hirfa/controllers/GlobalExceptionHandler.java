package com.advance.hirfa.controllers;

import com.advance.hirfa.domaine.dto.ErrorDto;
import com.advance.hirfa.exceptions.*;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex
    ) {
        log.error("Caught MethodArgumentNotValidException", ex);
        ErrorDto errorDto = new ErrorDto();

        BindingResult bindingResult = ex.getBindingResult();
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();

        String errorMessage = fieldErrors.stream()
                .findFirst()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .orElse("Validation error occurred");

        errorDto.setError(errorMessage);
        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundExceptions.class)
    public ResponseEntity<ErrorDto> handleUserNotFoundException(
            UserNotFoundExceptions ex
    ) {
        log.error("Caught User Not Found", ex);
        ErrorDto errorDto = new ErrorDto();

        // Use the exception message if available, or default string
        errorDto.setError(ex.getMessage() != null ? ex.getMessage() : "User not found");

        // Note: Change status from BAD_REQUEST to NOT_FOUND (404)
        return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(EventNotFoundExceptions.class)
    public ResponseEntity<ErrorDto> handleEventNotFoundException(
            EventNotFoundExceptions ex
    ) {
        log.error("Caught event Not Found", ex);
        ErrorDto errorDto = new ErrorDto();

        errorDto.setError(ex.getMessage() != null ? ex.getMessage() : "User not found");

        return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(QrCodeNotFoundExceptions.class)
    public ResponseEntity<ErrorDto> handleQrCodeNotFoundException(
            QrCodeNotFoundExceptions ex
    ) {
        log.error("Caught QrCode Not Found", ex);
        ErrorDto errorDto = new ErrorDto();

        errorDto.setError("Qr code not found");

        return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(TicketSoldOutExceptions.class)
    public ResponseEntity<ErrorDto> handleTicketSoldOutException(
            TicketSoldOutExceptions ex
    ) {
        log.error("Ticket solde out", ex);
        ErrorDto errorDto = new ErrorDto();

        errorDto.setError("Ticket solde out");

        return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(TicketNotFoundExceptions.class)
    public ResponseEntity<ErrorDto> handleTicketNotFoundExecption(
            TicketNotFoundExceptions ex
    ) {
        log.error("Ticket not found", ex);
        ErrorDto errorDto = new ErrorDto();

        errorDto.setError("Ticket not found");

        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(QrCodeGenerationExceptions.class)
    public ResponseEntity<ErrorDto> handleQrCodeGenerationException(
            QrCodeGenerationExceptions ex
    ) {
        log.error("Caught QrCodeGenerationExceptions", ex);
        ErrorDto errorDto = new ErrorDto();

        errorDto.setError("Unable to generate QR code");

        return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(TicketTypeNotFoundExceptions.class)
    public ResponseEntity<ErrorDto> handleTicketTypeNotFoundException(
            TicketTypeNotFoundExceptions ex
    ) {
        log.error("Caught ticket type Not Found", ex);
        ErrorDto errorDto = new ErrorDto();

        errorDto.setError(ex.getMessage() != null ? ex.getMessage() : "User not found");

        return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(EventUpdateNotFoundExceptions.class)
    public ResponseEntity<ErrorDto> handleEventUpdateException(
            EventNotFoundExceptions ex
    ) {
        log.error("Caught eventupdateException Not Found", ex);
        ErrorDto errorDto = new ErrorDto();

        errorDto.setError("Unable to update event");

        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorDto> handleConstraintViolation(
            ConstraintViolationException ex
    ) {
        log.error("Caught ConstraintViolationException", ex);

        ErrorDto errorDto = new ErrorDto();

        String errorMessage = ex.getConstraintViolations()
                .stream()
                .findFirst()
                .map(violation ->
                        violation.getPropertyPath() + ": " + violation.getMessage()
                )
                .orElse("Constraint violation occurred");

        errorDto.setError(errorMessage);

        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> handleException(Exception ex) {
        log.error("Caught exception", ex);
        ErrorDto errorDto= new ErrorDto();
        errorDto.setError("An unknown error occurred");
        return new ResponseEntity<>(errorDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
