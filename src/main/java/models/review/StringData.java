package models.review;
public class StringData {
    public String reviewId = "";      // auto-increment primary key
    public String webUserId = "";     // foreign key from web_user table (unique to each review_game_name entry)
    public String reviewGameName = "";// varchar(50) (unique to each web_user_id entry)

    public String errorMsg = "";      // not actually in the database, used by the app 
                                      // to convey success or failure.    
}
