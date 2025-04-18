package models.review;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.databind.ObjectMapper;

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

    @RequestMapping(value = "/review/update", params = {"jsonData"}, produces = "application/json")
    public String update(@RequestParam("jsonData") String jsonInsertData){
        StringData errorData = new StringData();

        if((jsonInsertData == null) || jsonInsertData.length() == 0){
            errorData.errorMsg = "Cannot update. No review data was provided in JSON format";
        }else{
            System.out.println("review data for update (JSON): " + jsonInsertData);
            try{
                ObjectMapper mapper = new ObjectMapper();
                StringData updateData = mapper.readValue(jsonInsertData, StringData.class);
                System.out.println("review data for update (java obj): " + updateData.toString());

                DbConn dbc = new DbConn();
                errorData = DbMods.update(updateData, dbc);
                dbc.close();
            }catch(Exception e){
                String msg = "Unexpected error in controller for 'review/insert'... " +
                        e.getMessage();
                System.out.println(msg);
                errorData.errorMsg = msg;
            }
        }

        return Json.toJson(errorData);
    }

}
