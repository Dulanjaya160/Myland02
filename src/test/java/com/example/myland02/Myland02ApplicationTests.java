package com.example.myland02;

import com.example.myland02.Myland02Application;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = Myland02Application.class)
@ActiveProfiles("test")
class Myland02ApplicationTests {

    @Test
    void contextLoads() {
    }

}
