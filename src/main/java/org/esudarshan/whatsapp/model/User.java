package org.esudarshan.whatsapp.model;

import java.time.LocalDate;
import java.util.UUID;

public class User {

    String id;
    String name;
    LocalDate registrationDate;

    public User(String name, LocalDate registrationDate) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.registrationDate = registrationDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }
}
