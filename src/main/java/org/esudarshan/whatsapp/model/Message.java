package org.esudarshan.whatsapp.model;

import java.time.LocalDate;
import java.util.UUID;

public class Message {

    private String id;
    private String from;
    private String to;
    private String message;
    private LocalDate date;
    private String status;

    public Message(String from, String to, String message, LocalDate date, String status) {
        this.id = UUID.randomUUID().toString();
        this.from = from;
        this.to = to;
        this.message = message;
        this.date = date;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Message{" +
                "id='" + id + '\'' +
                ", from='" + from + '\'' +
                ", to='" + to + '\'' +
                ", message='" + message + '\'' +
                ", date=" + date +
                ", status='" + status + '\'' +
                '}';
    }
}
