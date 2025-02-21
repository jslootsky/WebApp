package com.slootsky_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import models.review.*;
import dbUtils.*;
import view.ReviewView;

@RestController
public class ReviewController {

    @RequestMapping(value = "/review/getReviewGameName", produces = "application/json")
    public String allUsers(){
        StringDataList list = new StringDataList();
        DbConn dbc = new DbConn();
        list = ReviewView.getReviewGameName(dbc);

        dbc.close();

        return Json.toJson(list);
    }
    
}
