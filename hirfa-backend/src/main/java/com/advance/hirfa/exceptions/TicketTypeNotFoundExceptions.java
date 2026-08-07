package com.advance.hirfa.exceptions;

public class TicketTypeNotFoundExceptions extends EventTicketException{
    public TicketTypeNotFoundExceptions() {
    }

    public TicketTypeNotFoundExceptions(String message) {
        super(message);
    }

    public TicketTypeNotFoundExceptions(String message, Throwable cause) {
        super(message, cause);
    }

    public TicketTypeNotFoundExceptions(Throwable cause) {
        super(cause);
    }

    public TicketTypeNotFoundExceptions(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
