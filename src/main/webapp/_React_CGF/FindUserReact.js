function FindUserReact() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [userEmailInput, setUserEmailInput] = React.useState("");
    const [userPasswordInput, setUserPassword] = React.useState("");
    const [msg, setMsg] = React.useState("startMsg");

    function findClick() {
        setIsLoading(true);

        var url = "webUser/getByEmail?email=" + encodeURI(userEmailInput) + "&password=" + encodeURI(userPasswordInput);
        var defaultPfpUrl = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg";

        console.log("onclick function will call ajax_alt with this url: " + url);

        setMsg("findClick was called (testing)");

        ajax_alt(
            url,
            function (obj) {
                console.log("Ajax Success - got object (see next line)");
                console.log(obj);
                if (obj.errorMsg.length > 0) {
                    setMsg(<strong>{obj.errorMsg}</strong>);
                } else {
                    setMsg(
                        <div>
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
    }//findclick

    if (isLoading) {
        return (
            <div>
                <h1>... Loading ...</h1>
            </div>
        );
    }

    //input box should be in line with the email address text
    //password to be implemented later
    return (
        <div className="find">

            Email Address &nbsp;
            <input value={userEmailInput} onChange={(e) => setUserEmailInput(e.target.value)} />
            &nbsp;
            Password &nbsp;
            <input type="password" value={userPasswordInput} onChange={(e) => setUserPassword(e.target.value)} />
            <button onClick={findClick}>Find</button>
            <div>{msg}</div>
        </div>
    );
}

/* 
  "webUserId": "2",
  "userEmail": "ryan.renolds@action.com",
  "userPassword": "ppp",
  "userImage": "https://....jpg",
  "birthday": "",
  "membershipFee": "$89.84",
  "userRoleId": "2",
  "userRoleType": "View",
  "errorMsg": ""                 
 */