package org.esudarshan.whatsapp.controller;

import org.esudarshan.whatsapp.model.Message;
import org.esudarshan.whatsapp.model.User;
import org.esudarshan.whatsapp.repository.MessageRepository;
import org.esudarshan.whatsapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@CrossOrigin
@Controller
public class WhatsappController {

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/signup")
    @ResponseBody
    public User register(@RequestBody User user) {
        User existingUser = userRepository.findOneByName(user.getName());
        if (existingUser != null) {
            return null;
        }
        User newUser = new User(user.getName(), LocalDate.now());
        userRepository.save(newUser);
        simpMessagingTemplate.convertAndSend("/topic/users", newUser);
        return newUser;
    }

    @PostMapping("/login")
    @ResponseBody
    public User login(@RequestBody User user) {
        User existingUser = userRepository.findOneByName(user.getName());
        if (existingUser != null) {
            return existingUser;
        }
        return null;
    }

    @PostMapping("/send")
    @ResponseBody
    public Message send(@RequestBody Message message) {
        User fromUser = userRepository.findOneByName(message.getFrom());
        User toUser = userRepository.findOneByName(message.getTo());
        if (fromUser != null && toUser != null) {
            simpMessagingTemplate.convertAndSend("/topic/" + toUser.getId() + "/inbox", message);
            message.setStatus("SENT");
            messageRepository.save(message);
            simpMessagingTemplate.convertAndSend("/topic/" + fromUser.getId() + "/ack", message);
            return message;
        }
        return null;
    }

    @PostMapping("/ack")
    @ResponseBody
    public void ack(@RequestBody Message message) {
        User existingUser = userRepository.findOneByName(message.getFrom());
        if (existingUser != null) {
            messageRepository.delete(message);
            message.setStatus("DELIVERED");
            simpMessagingTemplate.convertAndSend("/topic/" + existingUser.getId() + "/ack", message);
        }
    }

    @GetMapping("/users")
    @ResponseBody
    public Collection<User> users() {
        return userRepository.findAll();
    }

    @PostMapping("/messages")
    @ResponseBody
    public void getMessages(@RequestBody User user) {
        List<Message> messages = messageRepository.findAllByTo(user.getName());
        if (!messages.isEmpty()) {
            messages.stream().forEach(msg -> {
                simpMessagingTemplate.convertAndSend("/topic/" + user.getId() + "/inbox", msg);
            });
        }
    }


}
