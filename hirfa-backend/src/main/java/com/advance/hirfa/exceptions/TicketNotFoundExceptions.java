package com.advance.hirfa.exceptions;

public class TicketNotFoundExceptions extends EventTicketException{
    public TicketNotFoundExceptions() {
    }

    public TicketNotFoundExceptions(String message) {
        super(message);
    }

    public TicketNotFoundExceptions(String message, Throwable cause) {
        super(message, cause);
    }

    public TicketNotFoundExceptions(Throwable cause) {
        super(cause);
    }

    public TicketNotFoundExceptions(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
