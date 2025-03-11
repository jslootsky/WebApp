const AjaxReviews = (url) => {
    console.log("AjaxReviews running");

    const [items, setItems] = React.useState([]);

    const [error, setError] = React.useState(null);

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        ajax_alt(
            url, // URL for AJAX call to invoke
            //"json/users.json", // URL for AJAX call to invoke
            //"webUser/getAll", // URL for AJAX call to invoke

            // success function (anonymous)
            function (dbList) {   // success function gets obj from ajax_alt
                if (dbList.dbError.length > 0) {
                    setError(dbList.dbError);
                } else {
                    console.log("in AjaxUsers, here is web user list (on the next line):");
                    console.log(dbList.reviewList);
                    setItems(dbList.reviewList);
                }
                setIsLoading(false); // set isLoading last to prevent premature rendering. 
            },

            // failure function (also anonymous)
            function (msg) {       // failure function gets error message from ajax_alt
                setError(msg);
                setIsLoading(false); // set isLoading last to prevent premature rendering.
            }
        );
    },
        []);

    if (isLoading) {
        console.log("Is Loading...");
        return <div> Loading... </div>
    }

    if (error) {
        console.log("Error...");
        return <div>Error: {error} </div>;
    }

    console.log("items for ReviewTable on next line");
    console.log(items);

    return (
        <div className="clickSort">
            <h3>
                Reviews List
            </h3>
            <table>
                <thead>
                    <tr>
                        <th>Review Id</th>
                        <th>Web User Id</th>
                        <th>Review Game Name</th>
                        <th className="textAlignCenter">Game Image</th>
                        <th>Review</th>
                        <th>Rating</th>
                        <th className="textAlignRight">Price</th>
                        <th className="textAlignRight">Playtime</th>
                        <th>Genre</th>
                        <th>Email</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        items.map((item, index) =>
                            <tr key={item.reviewId}>
                                <td>{item.reviewId}</td>
                                <td>{item.webUserId}</td>
                                <td>{item.reviewGameName}</td>
                                <td className="simple textAlignCenter"><img src={item.gameImageUrl} /></td>
                                <td>{item.userReview}</td>
                                <td>{item.userRating}</td>
                                <td class="textAlignRight">{item.gamePrice}</td>
                                <td class="textAlignRight">{item.userPlaytime}</td>
                                <td>{item.gameGenre}</td>
                                <td>{item.userEmail}</td>
                                <td>{item.errorMsg}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );

}