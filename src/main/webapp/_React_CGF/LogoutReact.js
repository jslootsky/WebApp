function LogoutReact() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [msg, setMsg] = React.useState("startMsg");

    React.useEffect(() => {
        logout();
    },
        []
    );

    function logout() {
        setIsLoading(true);

        console.log("Logout requested by user");

        ajax_alt(
            "/webUser/invalidate",//url
            function (obj) {
                console.log("Invalidation success - see object on next line");
                console.log(obj);
                setMsg(
                    <div>
                        <h2>You have been successfully logged out.</h2>
                    </div>
                );
                setIsLoading(false);
            },
            function (errorMsg) {
                console.log("AJAX error. Message: " + errMsg);
                setMsg("ajax failure: " + errorMsg);
                setIsLoading(false);
            }
        );
    }//logout

    if (isLoading) {
        return (
            <div>
                <h1>... Loading ...</h1>
            </div>
        );
    }

    return (
        <div>
            <div>{msg}</div>
        </div>
    );
}