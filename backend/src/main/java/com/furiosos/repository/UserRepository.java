package com.furiosos.repository;

import com.furiosos.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long>{

    User findById(long id);
    
    User findByEmail(String email);

}