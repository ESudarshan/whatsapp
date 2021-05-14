package org.esudarshan.whatsapp.controller;

import org.esudarshan.whatsapp.model.Message;
import org.esudarshan.whatsapp.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@Controller
public class WhatsappController {

    private Map<String, User> userMap = new HashMap<>();

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/signup")
    @ResponseBody
    public User register(@RequestBody User user) {
        if (userMap.containsKey(user.getName())) {
            return null;
        }
        User newUser = new User(user.getName(), LocalDate.now());
        userMap.put(newUser.getName(), newUser);
        simpMessagingTemplate.convertAndSend("/topic/users", newUser);
        return newUser;
    }

    @PostMapping("/login")
    @ResponseBody
    public User login(@RequestBody User user) {
        if (userMap.containsKey(user.getName())) {
            return userMap.get(user.getName());
        }
        User existingUser = userMap.get(user.getName());
        if (existingUser != null) {
            simpMessagingTemplate.convertAndSend("/topic/users", existingUser);
        }
        return existingUser;
    }

    @MessageMapping("/send")
    public void send(@Payload Message message) {
        if (userMap.containsKey(message.getTo())) {
            simpMessagingTemplate.convertAndSend("/topic/" + userMap.get(message.getTo()).getId() + "/inbox", message);
            message.setStatus("SENT");
            simpMessagingTemplate.convertAndSend("/topic/" + userMap.get(message.getFrom()).getId() + "/ack", message);
        }
    }


    @MessageMapping("/ack")
    public void ack(@Payload Message message) {
        if (userMap.containsKey(message.getFrom())) {
            message.setStatus("DELIVERED");
            simpMessagingTemplate.convertAndSend("/topic/" + userMap.get(message.getFrom()).getId() + "/ack", message);
        }
    }

    @GetMapping("/users")
    @ResponseBody
    public Collection<User> users() {
        return userMap.values();
    }

}
