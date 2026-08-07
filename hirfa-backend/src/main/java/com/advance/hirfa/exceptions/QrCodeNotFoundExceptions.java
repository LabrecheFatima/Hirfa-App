package com.advance.hirfa.exceptions;

public class QrCodeNotFoundExceptions extends EventTicketException{
    public QrCodeNotFoundExceptions() {
    }

    public QrCodeNotFoundExceptions(String message) {
        super(message);
    }

    public QrCodeNotFoundExceptions(String message, Throwable cause) {
        super(message, cause);
    }
    public QrCodeNotFoundExceptions(Throwable cause) {
        super(cause);
    }

    public QrCodeNotFoundExceptions(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
