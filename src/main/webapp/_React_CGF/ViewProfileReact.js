function ViewProfileReact(){
    const [isLoading, setIsLoading] = React.useState(false);
    const [msg, setMsg] = React.useState("startMsg");

    React.useEffect(() => {
        view();
    },
        []
    );

    function view(){
        setIsLoading(true);

        var url = "webUser/read";
        var defaultPfpUrl = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg";

        console.log("View will call ajax alt with this url: " + url);

        setMsg("View Profile requested by user.");

        ajax_alt(
            url,
            function(obj){
                console.log("Ajax Success - got object (see next line)");
                console.log(obj);
                if (obj.errorMsg != "") {
                    setMsg(<strong><br/>{obj.errorMsg}</strong>);
                } else {
                    setMsg(
                        <div className="find">
                            <h2>Welcome User {obj.webUserId}</h2>

                            Email: {obj.userEmail} <br />
                            Birthday: {obj.birthday}<br />
                            Membership Fee: {obj.membershipFee}<br />
                            User Role: {obj.userRoleId} {obj.userRoleType}<br />
                            <p><img src={obj.userImage || defaultPfpUrl} alt="User Profile" /></p>

                        </div>
                    );
                }
                setIsLoading(false);
            },
            function (errorMsg) {
                console.log("AJAX error. Message: " + errorMsg);
                setMsg("ajax failure: " + errorMsg);
                setIsLoading(false);
            }
        );
    }

    if (isLoading) {
        return (
            <div>
                <h1>... Loading ...</h1>
            </div>
        );
    }

    return(
        <div>
            {msg}
        </div>
    );
}

/*
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

*/