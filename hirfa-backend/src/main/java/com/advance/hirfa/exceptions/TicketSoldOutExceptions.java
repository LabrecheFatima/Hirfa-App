package com.advance.hirfa.exceptions;

public class TicketSoldOutExceptions extends EventTicketException{
    public TicketSoldOutExceptions() {
    }

    public TicketSoldOutExceptions(String message) {
        super(message);
    }

    public TicketSoldOutExceptions(String message, Throwable cause) {
        super(message, cause);
    }
    public TicketSoldOutExceptions(Throwable cause) {
        super(cause);
    }

    public TicketSoldOutExceptions(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
