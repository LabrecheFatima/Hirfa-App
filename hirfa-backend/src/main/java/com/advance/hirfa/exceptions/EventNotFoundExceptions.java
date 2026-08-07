package com.advance.hirfa.exceptions;

public class EventNotFoundExceptions extends EventTicketException{
    public EventNotFoundExceptions() {
    }

    public EventNotFoundExceptions(String message) {
        super(message);
    }

    public EventNotFoundExceptions(String message, Throwable cause) {
        super(message, cause);
    }
    public EventNotFoundExceptions(Throwable cause) {
        super(cause);
    }

    public EventNotFoundExceptions(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
