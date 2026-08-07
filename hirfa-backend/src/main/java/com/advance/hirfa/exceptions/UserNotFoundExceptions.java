package com.advance.hirfa.exceptions;

public class UserNotFoundExceptions extends EventTicketException{
    public UserNotFoundExceptions() {
    }

    public UserNotFoundExceptions(String message) {
        super(message);
    }

    public UserNotFoundExceptions(String message, Throwable cause) {
        super(message, cause);
    }

    public UserNotFoundExceptions(Throwable cause) {
        super(cause);
    }

    public UserNotFoundExceptions(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
