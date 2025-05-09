package com.slootsky_web;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.web.bind.annotation.RequestParam;

import models.webUser.*;
import dbUtils.*;
import jakarta.servlet.http.*;
import view.WebUserView;

@RestController
public class WebUserController {

    // private final SlootskyWebApplication slootskyWebApplication;

    // private final ReviewController reviewController;

    // private final Controller controller;

    WebUserController(Controller controller, ReviewController reviewController,
            SlootskyWebApplication slootskyWebApplication) {
        // this.controller = controller;
        // this.reviewController = reviewController;
        // this.slootskyWebApplication = slootskyWebApplication;
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
    public String getById(@RequestParam("email") String email, @RequestParam("password") String password,
            HttpServletRequest request) {
        HttpSession session = request.getSession();
        System.out.println("getByEmail - Session ID: " + session.getId()); // Log session ID
        StringData sd = new StringData();
        if (email == null || email.trim().isEmpty()) {
            sd.errorMsg = "Error: email is null. Please enter an email";
            return Json.toJson(sd);
        } else if (password == null || password.trim().isEmpty()) {
            sd.errorMsg = "Error: password is null. Please enter a password";
            return Json.toJson(sd);
        } else {
            DbConn dbc = new DbConn();
            sd = DbMods.getByEmail(dbc, email, password);
            dbc.close();
        }

        // checks if the errorMsg field is at all populated
        if (sd.errorMsg.length() > 0) {
            String errorMsg = sd.errorMsg;
            sd = new StringData(); // sets all fields to ""
            try {
                session.invalidate();
                sd.errorMsg += errorMsg + "\nSession has been invalidated.";// appends notification that session has
                                                                            // been invalidated
            } catch (Exception e) {
                System.out.println("webUser/invalidate controller error: " + e.getMessage());
                sd.errorMsg += ". " + e.getMessage();
            }
        } else {
            try {
                session.setAttribute("myUser", sd);
                System.out.println("getByEmail - myUser set: " + sd); // Log the user data
            } catch (Exception e) {
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
        System.out.println("read - Session ID: " + session.getId()); // Log session ID
        StringData sd = new StringData();
        System.out.println("read - myUser retrieved: " + sd); // Log the user data

        try {
            sd = (StringData) session.getAttribute("myUser");
            if (sd == null) {
                sd = new StringData();
                sd.errorMsg = "No user logged in";
            }
        } catch (Exception e) {
            System.out.println("webUser/read controller error: " + e.getMessage());
            sd.errorMsg += ". " + e.getMessage();
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/insert", params = { "jsonData" }, produces = "application/json")
    public String insert(@RequestParam("jsonData") String jsonInsertData) {

        StringData errorMsgs = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorMsgs.errorMsg = "Cannot insert. No user data was provided in JSON format";
        } else {
            System.out.println("user data for insert (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData insertData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("user data for insert (java obj): " + insertData.toString());

                DbConn dbc = new DbConn();
                errorMsgs.errorMsg = dbc.getErr();
                if (errorMsgs.errorMsg.length() == 0) { // db connection OK
                    errorMsgs = DbMods.insert(insertData, dbc);
                }
                dbc.close();
            } catch (Exception e) {
                String msg = "Could not convert jsonData to model.webUser.StringData obj: " +
                        jsonInsertData + " - or other error in controller for 'user/insert': " +
                        e.getMessage();
                System.out.println(msg);
                errorMsgs.errorMsg += ". " + msg;
            }
        }
        return Json.toJson(errorMsgs);
    }

    @RequestMapping(value = "/webUser/update", params = { "jsonData" }, produces = "application/json")
    public String update(@RequestParam("jsonData") String jsonInsertData) {

        StringData errorData = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorData.errorMsg = "Cannot update. No user data was provided in JSON format";
        } else {
            System.out.println("user data for update (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData updateData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("user data for update (java obj): " + updateData.toString());

                // The next 3 statements handle their own exceptions (so should not throw any
                // exception).
                DbConn dbc = new DbConn();
                errorData = DbMods.update(updateData, dbc);
                dbc.close();
            } catch (Exception e) {
                String msg = "Unexpected error in controller for 'webUser/insert'... " +
                        e.getMessage();
                System.out.println(msg);
                errorData.errorMsg = msg;
            }
        }
        return Json.toJson(errorData);
    }

    @RequestMapping(value = "/webUser/getById", params = {
            "userId" }, produces = "application/json")
    public String getById(@RequestParam("userId") String userId) {
        StringData sd = new StringData();
        if (userId == null) {
            sd.errorMsg = "Error: URL must be user/getById/xx " +
                    "where xx is the web_user_id of the desired web_user record.";
        } else {
            DbConn dbc = new DbConn();
            sd.errorMsg = dbc.getErr();
            if (sd.errorMsg.length() == 0) {
                System.out.println("*** Ready to call DbMods.getById");
                sd = DbMods.getById(dbc, userId);
            }
            dbc.close();
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/delete", params = { "userId" }, produces = "application/json")
    public String delete(@RequestParam("userId") String deleteUserId) {
        StringData sd = new StringData();
        if (deleteUserId == null) {
            sd.errorMsg = "Error: URL must be user/getById?userId=xx, where " +
                    "xx is the web_user_id of the web_user record to be deleted.";
        } else {
            DbConn dbc = new DbConn();
            sd = DbMods.delete(dbc, deleteUserId);
            dbc.close();
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/deletePreview", params = { "userId" }, produces = "application/json")
    public String deletePreview(@RequestParam("userId") String userId) {
        StringData sd = new StringData();

        if (userId == null) {
            sd.errorMsg = "Error: URL must be webUser/deletePreview?userId=xx, where xx is the user’s ID.";
            return Json.toJson(sd);
        }

        DbConn dbc = new DbConn();

        sd.errorMsg = dbc.getErr();
        if (sd.errorMsg.length() > 0) {
            dbc.close();
            return Json.toJson(sd);
        }

        try (
                PreparedStatement countStmt = dbc.getConn()
                        .prepareStatement("SELECT COUNT(*) FROM review WHERE web_user_id = ?");) {
            countStmt.setString(1, userId);
            try (ResultSet rs = countStmt.executeQuery()) {
                if (rs.next()) {
                    sd.numReviewsToBeDeleted = rs.getInt(1);
                }
            }
        } catch (Exception e) {
            sd.errorMsg = "Exception in deletePreview: " + e.getMessage();
        }

        dbc.close();
        return Json.toJson(sd);
    }

}