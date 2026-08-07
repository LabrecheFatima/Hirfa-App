package com.advance.hirfa.exceptions;

public class EventUpdateNotFoundExceptions extends EventTicketException{
    public EventUpdateNotFoundExceptions() {
    }

    public EventUpdateNotFoundExceptions(String message) {
        super(message);
    }

    public EventUpdateNotFoundExceptions(String message, Throwable cause) {
        super(message, cause);
    }

    public EventUpdateNotFoundExceptions(Throwable cause) {
        super(cause);
    }

    public EventUpdateNotFoundExceptions(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
