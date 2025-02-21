package models.webUser;
public class StringData {
    public String webUserId = "";     // auto-increment primary key
    public String userEmail = "";     // varChar 45, must be unique
    public String userPassword = "";  // varChar 45, required (length >=1)
    public String userImage = "";     // varChar 500, required (length >=1)
    public String birthday = "";      // type date, optional
    public String membershipFee = ""; // type decimal, optional
    public String userRoleId = "";    // foreign key (integer), required by DB
    public String userRoleType = "";  // varChar, joined from user_role table.

    public String errorMsg = "";      // not actually in the database, used by the app 
                                      // to convey success or failure.    
}
