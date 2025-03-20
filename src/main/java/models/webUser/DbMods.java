package models.webUser;

import dbUtils.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class DbMods {
    
    public static StringData getByEmail(DbConn dbc, String email){
        StringData sd = new StringData();  
        if(email == null){
            sd.errorMsg = "Cannot getByEmail (user): email is null";
            return sd;
        }

        sd.errorMsg = dbc.getErr();
        if(sd.errorMsg.length() > 0){
            return sd;
        }

        String stringEmail;
        try{
            stringEmail = String.valueOf(email);
        }catch(Exception e){
            sd.errorMsg = "Cannot getByEmail (user): URL parameter 'email' cant be converted to an String.";
            return sd;
        }

        try{
            String sql = "SELECT web_user_id, user_email, user_password, membership_fee, birthday, "
                    + "user_image, web_user.user_role_id, user_role_type "
                    + "FROM web_user, user_role WHERE web_user.user_role_id = user_role.user_role_id "
                    + "AND user_email = ?";
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            stmt.setString(1, stringEmail);

            ResultSet results = stmt.executeQuery();
            if(results.next()){
                sd.webUserId = Format.fmtInteger(results.getObject("web_user_id"));
                sd.userEmail = Format.fmtString(results.getObject("user_email"));
                sd.userPassword = Format.fmtString(results.getObject("user_password"));
                sd.userImage = Format.fmtString(results.getObject("user_image"));
                sd.birthday = Format.fmtDate(results.getObject("birthday"));
                sd.membershipFee = Format.fmtDollar(results.getObject("membership_fee"));
                sd.userRoleId = Format.fmtInteger(results.getObject("web_user.user_role_id"));
                sd.userRoleType = Format.fmtString(results.getObject("user_role_type"));
            }else{
                sd.errorMsg = "Web User Not Found.";
            }
            results.close();
            stmt.close();
        }catch (Exception e){
            sd.errorMsg = "Exception thrown in model.webUser.DbMods.getByEmail(): " + e.getMessage();
        }

        return sd;
    }//getByEmail
}
