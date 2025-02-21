package view;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import models.review.*;
import dbUtils.*;

public class ReviewView {

    public static StringDataList getReviewGameName(DbConn dbc){
        //empty array with empty errore
        StringDataList sdl = new StringDataList();

        sdl.dbError = dbc.getErr();//returns "" if there is an error
        if(sdl.dbError.length() > 0){//checks is dbError is not empty
            return sdl;
        }

        StringData sd = new StringData();

        try{
            String sql = "SELECT review_id, review_game_name, review.web_user_id " + //
                                "FROM review " + //
                                "ORDER BY review_id;";
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();

            while(results.next()){
                sd = new StringData();
                
                sd.reviewId = Format.fmtInteger(results.getObject("review_Id"));
                sd.reviewGameName = Format.fmtString(results.getObject("review_game_name"));
                sd.webUserId = Format.fmtInteger(results.getObject("web_user_id"));

                sdl.add(sd);
            }

            results.close();
            stmt.close();

        }catch(Exception e){
            sd.errorMsg = "Exception thrown in ReviewView.getReviewGameName(): " + e.getMessage();
            sdl.add(sd);
        }

        return sdl;
    }

}
