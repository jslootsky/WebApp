package models.review;

public class StringData {
    public String reviewId = ""; // auto-increment primary key
    public String webUserId = ""; // foreign key from web_user table (unique to each review_game_name entry)
    public String reviewGameName = ""; // varchar(50) (unique to each web_user_id entry)
    public String gameImageUrl = ""; // VARCHAR(1000)
    public String userReview = ""; // VARCHAR(500)
    public String userRating = ""; // ENUM('1', '2', '3', '4', '5')
    public String gamePrice = ""; // DECIMAL(10,2)
    public String userPlaytime = ""; // DECIMAL(6,1)
    public String gameGenre = ""; // ENUM('Action', 'Adventure', 'RPG', 'Shooter', 'Sports', 'Other')
    public String userEmail = ""; // VARCHAR(45)

    public String errorMsg = ""; // not actually in the database, used by the app
                                 // to convey success or failure.

    public StringData() {

    }

    public int characterCount() {
        String s = this.reviewId + this.webUserId + this.reviewGameName +
                this.gameImageUrl + this.userReview + this.userRating +
                this.gamePrice + this.userPlaytime + this.gameGenre;
        return s.length();
    }

    public String toString() {
        return "Review Id:" + this.reviewId
                + ", User Id: " + this.webUserId
                + ", Game Name: " + this.reviewGameName
                + ", Game Image URL: " + this.gameImageUrl
                + ", User Review: " + this.userReview
                + ", User Rating: " + this.userRating
                + ", Game Price: " + this.gamePrice
                + ", Playtime: " + this.userPlaytime
                + ", Genre: " + this.gameGenre
                + ", User Email: " + this.userEmail;
    }
}
