package com.slootsky_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import models.webUser.*;
import dbUtils.*;
import jakarta.servlet.http.*;
import view.WebUserView;

@RestController
public class WebUserController {

    private final SlootskyWebApplication slootskyWebApplication;

    private final ReviewController reviewController;

    private final Controller controller;

    WebUserController(Controller controller, ReviewController reviewController, SlootskyWebApplication slootskyWebApplication) {
        this.controller = controller;
        this.reviewController = reviewController;
        this.slootskyWebApplication = slootskyWebApplication;
    }

    @RequestMapping(value = "/webUser/getAll", produces = "application/json")
    public String allUsers() {

        StringDataList list = new StringDataList(); // dbError empty, list empty
        DbConn dbc = new DbConn();
        list = WebUserView.getAllUsers(dbc);

        dbc.close(); // EVERY code path that opens a db connection must close it
                     // (or else you have a database connection leak).

        return Json.toJson(list); // convert sdl obj to JSON Format and return that.
    }

    @RequestMapping(value = "/webUser/getByEmail", params = { "email", "password" }, produces = "application/json")
    public String getById(@RequestParam("email") String email, @RequestParam("password") String password, HttpServletRequest request){
        HttpSession session = request.getSession();  
        StringData sd = new StringData();
        if(email == null){
            sd.errorMsg = "Error: email is null. Please enter an email";
            return Json.toJson(sd);
        }else if(password == null){
            sd.errorMsg = "Error: password is null. Please enter a password";
            return Json.toJson(sd);
        }else{
            DbConn dbc = new DbConn();
            sd = DbMods.getByEmail(dbc, email, password);
            dbc.close();
        }

        //checks if the errorMsg field is at all populated
        if(sd.errorMsg.length() > 0){
            String errorMsg = sd.errorMsg;
            sd = new StringData(); //sets all fields to ""
            try{
                session.invalidate();
                sd.errorMsg += errorMsg + "\nSession has been invalidated.";//appends notification that session has been invalidated
            }catch (Exception e){
                System.out.println("webUser/invalidate controller error: " + e.getMessage());
                sd.errorMsg += ". " + e.getMessage();
            }
        }else{
            try{
                session.setAttribute("myUser", sd);
            }catch(Exception e){
                System.out.println("webUser/getByEmail controller error: " + e.getMessage());
                sd.errorMsg += ". " + e.getMessage();
            }
        }

        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/invalidate", produces = "application/json")
    public String invalidateController(HttpServletRequest request) {
        HttpSession session = request.getSession();

        StringData sd = new StringData(); // all fields now set to ""

        try {
            session.invalidate();
            sd.errorMsg = "Session has been invalidated";
        } catch (Exception e) {
            System.out.println("webUser/invalidate controller error: " + e.getMessage());
            sd.errorMsg += ". " + e.getMessage();
        }

        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/read", produces = "application/json")
    public String readController(HttpServletRequest request) {

        HttpSession session = request.getSession();
        StringData sd = new StringData();

        try {
            sd = (StringData) session.getAttribute("myUser");
            if(sd == null){
                sd = new StringData();
                sd.errorMsg = "No user logged in";
            }
        } catch (Exception e) {
            System.out.println("webUser/read controller error: " + e.getMessage());
            sd.errorMsg += ". " + e.getMessage();
        }
        return Json.toJson(sd);
    }
    
}