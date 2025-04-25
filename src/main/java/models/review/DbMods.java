package models.review;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import dbUtils.*;

public class DbMods {
    /*
     * Returns a "StringData" object that is full of field level validation
     * error messages (or "" for any field that passes validation).
     */
    private static StringData validate(StringData inputData) {

        StringData errorMsgs = new StringData();

        /*
         *  public String reviewId = "";        // auto-increment primary key NN
            public String webUserId = "";       // foreign key from web_user table (unique to each review_game_name entry) NN
            public String reviewGameName = "";  // varchar(50) (unique to each web_user_id entry) NN
            public String gameImageUrl = "";    // VARCHAR(1000)
            public String userReview = "";      // VARCHAR(500)
            public String userRating = "";      // ENUM('1', '2', '3', '4', '5') NN
            public String gamePrice = "";       // DECIMAL(10,2)
            public String userPlaytime = "";    // DECIMAL(6,1)
            public String gameGenre = "";       // ENUM('Action', 'Adventure', 'RPG', 'Shooter', 'Sports', 'Other') NN

            public String errorMsg = "";      // not actually in the database, used by the app 
                                            // to convey success or failure.    
         */
        // Validation

        errorMsgs.webUserId = Validate.integerMsg(inputData.webUserId, true);
        errorMsgs.reviewGameName = Validate.stringMsg(inputData.reviewGameName, 50, true);
        errorMsgs.gameImageUrl = Validate.stringMsg(inputData.gameImageUrl, 1000, false);
        errorMsgs.userReview = Validate.stringMsg(inputData.userReview, 500, false);
        errorMsgs.userRating = Validate.integerMsg(inputData.userRating, true);
        errorMsgs.gamePrice = Validate.decimalMsg(inputData.gamePrice, false);
        errorMsgs.userPlaytime = Validate.decimalMsg(inputData.userPlaytime, false);
        errorMsgs.gameGenre = Validate.stringMsg(inputData.gameGenre, 10, true);

        return errorMsgs;
    } // validate

    public static StringData getById(DbConn dbc, String id) {
        StringData sd = new StringData();
        if (id == null) {
            sd.errorMsg = "Cannot getById (review): id is null";
            return sd;
        }

        Integer intId;
        try {
            intId = Integer.valueOf(id);
        } catch (Exception e) {
            sd.errorMsg = "Cannot getById (review): URL parameter 'id' can't be converted to an integer.";
            return sd;
        }
        try {
            String sql = "SELECT review_id, review_game_name, game_image_url, user_review, user_rating, \n" + //
                    "game_price, user_playtime, game_genre, \n" + //
                    "review.web_user_id, user_email\n" + //
                    "FROM review \n" + //
                    "LEFT JOIN web_user ON review.web_user_id = web_user.web_user_id\n" + //
                    "WHERE review_id = ?;";
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            stmt.setInt(1, intId);

            ResultSet results = stmt.executeQuery();
            if (results.next()) {
                sd.reviewId = Format.fmtInteger(results.getObject("review_id"));
                sd.reviewGameName = Format.fmtString(results.getObject("review_game_name"));
                sd.gameImageUrl = Format.fmtString(results.getObject("game_image_url"));
                sd.userReview = Format.fmtString(results.getObject("user_review"));
                sd.userRating = Format.fmtString(results.getObject("user_rating"));// may cause an error since it is
                                                                                   // enum
                sd.gamePrice = Format.fmtDollar(results.getObject("game_price"));
                sd.userPlaytime = Format.fmtDecimal(results.getObject("user_playtime"));// user playtime technically
                                                                                        // decimal
                sd.gameGenre = Format.fmtString(results.getObject("game_genre"));// may cuase an error since it is enum
                sd.webUserId = Format.fmtInteger(results.getObject("review.web_user_id"));
                sd.userEmail = Format.fmtString(results.getObject("user_email"));
            } else {
                sd.errorMsg = "Web User Not Found.";
            }
            results.close();
            stmt.close();

        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in models.review.DbMods.getById(): " + e.getMessage();
        }

        return sd;
    }// getById


    public static StringData insert(StringData inputData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.characterCount() > 0) { // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            /* 
             * String sql = 
             * "SELECT review_id, web_user_id, review_game_name, game_image_url, user_review, user_rating, "+
             * "game_price, user_playtime, game_genre, user_email "+
             * "FROM review" +
             * "ORDER BY web_user_id ";
             */
            // Start preparing SQL statement

            // String sql = "INSERT INTO web_user (user_email, user_password, user_image, membership_fee, birthday, " +
            //         "user_role_id) values (?,?,?,?,?,?)";

            String sql = "INSERT INTO review (web_user_id, review_game_name, game_image_url, user_review, user_rating, " +
                        "game_price, user_playtime, game_genre) values (?,?,?,?,?,?,?,?)";
            

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setInt(1, Validate.convertInteger(inputData.webUserId));
            pStatement.setString(2, inputData.reviewGameName);
            pStatement.setString(3, inputData.gameImageUrl);
            pStatement.setString(4, inputData.userReview);
            pStatement.setString(5, inputData.userRating);
            pStatement.setBigDecimal(6, Validate.convertDecimal(inputData.gamePrice));
            pStatement.setBigDecimal(7, Validate.convertDecimal(inputData.userPlaytime));
            pStatement.setString(8, inputData.gameGenre);
            

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to
                                             // the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk
                    // sql update.
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid Web User Id - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "Only one review per web user allowed - " + errorMsgs.errorMsg;
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // insert

    public static StringData update(StringData updateData, DbConn dbc) {
        StringData errorMsgs = new StringData();
        errorMsgs = validate(updateData);

        errorMsgs.reviewId = Validate.integerMsg(updateData.reviewId, true);

        if (errorMsgs.characterCount() > 0) {
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;
        } else {
            /*
             * String sql =
             * "SELECT review_id, web_user_id, review_game_name, game_image_url, user_review, user_rating, "
             * +
             * "game_price, user_playtime, game_genre, user_email "+
             * "FROM review" +
             * "ORDER BY web_user_id ";
             */

            /*
             * String sql = "INSERT INTO review (web_user_id, review_game_name,
             * game_image_url,
             * user_review, user_rating, " +
             * "game_price, user_playtime, game_genre) values (?,?,?,?,?,?,?,?)";
             */
            String sql = "UPDATE review SET web_user_id = ?, review_game_name = ?, game_image_url = ?, user_review = ?, user_rating = ?, "
                    +   "game_price = ?, user_playtime = ?, game_genre = ? WHERE review_id = ?;";
            
            PrepStatement pStatement = new PrepStatement(dbc, sql);
            pStatement.setInt(1, Validate.convertInteger(updateData.webUserId));
            pStatement.setString(2, updateData.reviewGameName);
            pStatement.setString(3, updateData.gameImageUrl);
            pStatement.setString(4, updateData.userReview);
            pStatement.setString(5, updateData.userRating);
            pStatement.setBigDecimal(6, Validate.convertDecimal(updateData.gamePrice));
            pStatement.setBigDecimal(7, Validate.convertDecimal(updateData.userPlaytime));
            pStatement.setString(8, updateData.gameGenre);
            pStatement.setInt(9, Validate.convertInteger(updateData.reviewId));

            int numRows = pStatement.executeUpdate();

            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if(errorMsgs.errorMsg.length() == 0){
                if(numRows == 1){
                    errorMsgs.errorMsg = "";
                }else{
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            }else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid Web User Id - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "Only one review per web user allowed - " + errorMsgs.errorMsg;
            }
        }

        return errorMsgs;
    }//update

    public static StringData delete(DbConn dbc, String reviewId){
        StringData sd = new StringData();

        if(reviewId == null){
            sd.errorMsg = "models.review.DbMods.delete: " +
                    "cannot delete web_user record because 'reviewId' is null";
            return sd;
        }

        sd.errorMsg = dbc.getErr();
        if(sd.errorMsg.length() > 0){
            return sd;
        }

        try{
            //perform delete
            String sql = "DELETE FROM review WHERE review_id = ?";
            
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            pStatement.setString(1, reviewId);

            int numRowsDeleted = pStatement.executeUpdate();

            if(numRowsDeleted == 0){
                sd.errorMsg = "Record not deleted - there was no record with review_id " + reviewId;
            }else if (numRowsDeleted > 1) {
                sd.errorMsg = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }
        }catch (Exception e){
            sd.errorMsg = "Exception thrown in models.review.DbMods.delete(): " + e.getMessage();
        }

        return sd;
    }//delete

}
