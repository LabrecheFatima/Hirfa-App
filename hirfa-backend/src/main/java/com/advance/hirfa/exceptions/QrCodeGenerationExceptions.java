package com.advance.hirfa.exceptions;

public class QrCodeGenerationExceptions extends EventTicketException{
    public QrCodeGenerationExceptions() {
    }

    public QrCodeGenerationExceptions(String message) {
        super(message);
    }

    public QrCodeGenerationExceptions(String message, Throwable cause) {
        super(message, cause);
    }
    public QrCodeGenerationExceptions(Throwable cause) {
        super(cause);
    }

    public QrCodeGenerationExceptions(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
