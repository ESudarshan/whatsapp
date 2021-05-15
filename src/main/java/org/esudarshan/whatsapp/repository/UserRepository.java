package org.esudarshan.whatsapp.repository;

import org.esudarshan.whatsapp.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    User findOneByName(String name);
}
