package com.slootsky_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import models.review.*;
import dbUtils.*;
import view.ReviewView;

@RestController
public class ReviewController {

    @RequestMapping(value = "/review/getReviewGameName", produces = "application/json")
    public String allUsers() {
        StringDataList list = new StringDataList();
        DbConn dbc = new DbConn();
        list = ReviewView.getReviewGameName(dbc);

        dbc.close();

        return Json.toJson(list);
    }

    @RequestMapping(value = "/review/getById", params = { "reviewId" }, produces = "application/json")
    public String getById(@RequestParam("reviewId") String reviewId) {
        StringData sd = new StringData();
        if (reviewId == null) {
            sd.errorMsg = "Error: URL must be review/getById/xx" +
                    "where xx is the review_id of the desired review record.";
        } else {
            DbConn dbc = new DbConn();
            sd.errorMsg = dbc.getErr();
            if (sd.errorMsg.length() == 0) {
                System.out.println("*** Ready to call DbMods.getById");
                sd = DbMods.getById(dbc, reviewId);
            }
            dbc.close();
        }

        return Json.toJson(sd);
    }

    @RequestMapping(value = "/review/insert", params = { "jsonData" }, produces = "application/json")
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
                String msg = "Could not convert jsonData to model.review.StringData obj: " +
                        jsonInsertData + " - or other error in controller for 'user/insert': " +
                        e.getMessage();
                System.out.println(msg);
                errorMsgs.errorMsg += ". " + msg;
            }
        }

        return Json.toJson(errorMsgs);
    }

    @RequestMapping(value = "/review/update", params = { "jsonData" }, produces = "application/json")
    public String update(@RequestParam("jsonData") String jsonInsertData) {
        StringData errorData = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorData.errorMsg = "Cannot update. No review data was provided in JSON format";
        } else {
            System.out.println("review data for update (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData updateData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("review data for update (java obj): " + updateData.toString());

                DbConn dbc = new DbConn();
                errorData = DbMods.update(updateData, dbc);
                dbc.close();
            } catch (Exception e) {
                String msg = "Unexpected error in controller for 'review/insert'... " +
                        e.getMessage();
                System.out.println(msg);
                errorData.errorMsg = msg;
            }
        }

        return Json.toJson(errorData);
    }

    @RequestMapping(value = "/review/delete", params = { "reviewId" }, produces = "application/json")
    public String delete(@RequestParam("reviewId") String deleteReviewId) {
        StringData sd = new StringData();
        if (deleteReviewId == null) {
            sd.errorMsg = "Error: URL must be review/delete?reviewId=xx, where " +
                    "xx is the review_id of the web_user record to be deleted.";
        } else {
            DbConn dbc = new DbConn();
            sd = DbMods.delete(dbc, deleteReviewId);
            dbc.close();
        }
        return Json.toJson(sd);
    }
}
