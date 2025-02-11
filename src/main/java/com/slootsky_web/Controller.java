package com.slootsky_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {

    @RequestMapping("/hello")
    public String helloController(){
        return "<h1>Hello World</h1>";
    }
    @RequestMapping("/goodbye")
    public String hw1ControllerGoodbye(){
        return "<h1>Goodbye!";
    }
}
