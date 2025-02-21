package view;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import models.review.*;
import dbUtils.*;

public class ReviewView {

    public static StringDataList getReviewGameName(DbConn dbc){
        //empty array with empty errore
        StringDataList sdl = new StringDataList();

        sdl.dbError = dbc.getErr();//returns "" if there is no error
        if(sdl.dbError.length() > 0){//checks is dbError is not empty
            return sdl;
        }

        StringData sd = new StringData();

        try{
            // String sql = "SELECT review_id, review_game_name, review.web_user_id " + //
            //                     "FROM review " + //
            //                     "ORDER BY review_id;";
            String sql2 = "SELECT review_id, review_game_name, game_image_url, user_review, user_rating, \n" + //
                                "game_price, user_playtime, game_genre, \n" + //
                                "review.web_user_id, user_email\n" + //
                                "FROM review \n" + //
                                "LEFT JOIN web_user ON review.web_user_id = web_user.web_user_id\n" + //
                                "ORDER BY review_id;";
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql2);
            ResultSet results = stmt.executeQuery();

            while(results.next()){
                sd = new StringData();
                
                sd.reviewId = Format.fmtInteger(results.getObject("review_id"));
                sd.reviewGameName = Format.fmtString(results.getObject("review_game_name"));
                sd.gameImageUrl = Format.fmtString(results.getObject("game_image_url"));
                sd.userReview = Format.fmtString(results.getObject("user_review"));
                sd.userRating = Format.fmtString(results.getObject("user_rating"));//may cause an error since it is enum
                sd.gamePrice = Format.fmtDollar(results.getObject("game_price"));
                sd.userPlaytime = Format.fmtDecimal(results.getObject("user_playtime"));//user playtime technically decimal
                sd.gameGenre = Format.fmtString(results.getObject("game_genre"));//may cuase an error since it is enum
                sd.webUserId = Format.fmtInteger(results.getObject("review.web_user_id"));
                sd.userEmail = Format.fmtString(results.getObject("user_email"));
                

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
