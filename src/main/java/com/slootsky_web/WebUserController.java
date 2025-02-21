package com.slootsky_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import models.webUser.*;
import dbUtils.*;
import view.WebUserView;

@RestController
public class WebUserController {

    @RequestMapping(value = "/webUser/getAll", produces = "application/json")
    public String allUsers() {

        StringDataList list = new StringDataList(); // dbError empty, list empty
        DbConn dbc = new DbConn();
        list = WebUserView.getAllUsers(dbc);

        dbc.close(); // EVERY code path that opens a db connection must close it
                     // (or else you have a database connection leak).

        return Json.toJson(list); // convert sdl obj to JSON Format and return that.
    }
}