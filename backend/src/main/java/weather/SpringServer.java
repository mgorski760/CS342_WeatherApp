package weather;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/*
Spring Server.

This file is what runs the Spring Server on the backend.

From here, within the "weather" package (file) for all the routes.

HOW TO RUN:
    To start the server, enter into terminal: mvn spring-boot:run
    It should be within localhost:8080 by default.

    LINK: http://localhost:8080/test
 */

@SpringBootApplication
public class SpringServer {
    public static void main(String[] args) {
        SpringApplication.run(SpringServer.class, args);
    }
}

