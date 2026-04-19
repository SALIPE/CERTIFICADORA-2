package com.furiosos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class FuriososApplication {
	public static void main(String[] args) {
		SpringApplication.run(FuriososApplication.class, args);
	}

}
