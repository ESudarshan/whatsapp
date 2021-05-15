package org.esudarshan.whatsapp.repository;

import org.esudarshan.whatsapp.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findAllByTo(String to);
}
