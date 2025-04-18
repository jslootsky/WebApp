"use strict";

const ReviewInsertOrUpdate = (props) => {
    var action = "insert";
    var id = "";
    var url = props.location.pathname;
    console.log("url that invoked ReviewInsertOrUpdate is " + url);
    if (url.search(":") > -1) {
        const url_list = url.split(":");
        id = url_list[url_list.length - 1];//id is last element
        console.log("to update id " + id);
        action = "update";
    } else {
        console.log("to insert");
    }

    const [reviewData, setReviewData] = React.useState(
        {
            "reviewId": "",
            "webUserId": "",
            "reviewGameName": "",
            "gameImageUrl": "",
            "userReview": "",
            "userRating": "",
            "gamePrice": "",
            "userPlaytime": "",
            "gameGenre": "",
            "userEmail": "",
            "errorMsg": ""
        }
    );

    const [genreList, setGenreList] = React.useState(["Select a genre", "Action", "Adventure", "RPG", "Shooter", "Sports", "Strategy", "Other"]);
    const [ratingList, setRatingList] = React.useState(["Select a rating", "1", "2", "3", "4", "5"]);

    //holds emails which will populate the select tag for the UI
    const [emailList, setEmailList] = React.useState([]);


    //make a useState for the genre list and rating list dropdown

    const [errorObj, setErrorObj] = React.useState(
        {
            "reviewId": "",
            "webUserId": "",
            "reviewGameName": "",
            "gameImageUrl": "",
            "userReview": "",
            "userRating": "",
            "gamePrice": "",
            "userPlaytime": "",
            "gameGenre": "",
            "userEmail": "",
            "errorMsg": ""
        }
    );

    const [isLoading, setIsLoading] = React.useState(true);

    const [isLoadingRoleList, setIsLoadingRoleList] = React.useState(true);
    const [isLoadingUser, setIsLoadingUser] = React.useState(true);
    const [isLoadingSaveResponse, setIsLoadingSaveResponse] = React.useState(false);


    const encodeUserInput = () => {
        var reviewInputObj = {
            "reviewId": reviewData.reviewId,
            "webUserId": reviewData.webUserId,
            "reviewGameName": reviewData.reviewGameName,
            "gameImageUrl": reviewData.gameImageUrl,
            "userReview": reviewData.userReview,
            "userRating": reviewData.userRating,
            "gamePrice": reviewData.gamePrice,
            "userPlaytime": reviewData.userPlaytime,
            "gameGenre": reviewData.gameGenre,
            "userEmail": reviewData.userEmail
        };
        console.log("reviewInputObj on next line");
        console.log(reviewInputObj);
        return encodeURI(JSON.stringify(reviewInputObj));
    }

    const setProp = (obj, propName, propValue) => {
        var o = Object.assign({}, obj);
        o[propName] = propValue;
        return o;
    }

    //note: this does not yet query the available genres

    React.useEffect(() => {
        console.log("Initializing Insert/Update component");

        console.log("AJAX call for the user list");
        ajax_alt(
            "webUser/getAll",
            function (obj) {
                console.log("review/getReviewGameName Ajax success");
                if (obj.dbError.length > 0) {//db error reading review list
                    setErrorObj(setProp(errorObj, "webUserId", obj.dbError));
                } else {
                    obj.webUserList.sort(function (a, b) {
                        if (a.userEmail > b.userEmail) {
                            return 1;
                        } else {
                            return -1;
                        }
                        return 0;
                    });
                    console.log("sorted email list on next line");
                    console.log(obj.webUserList);
                    setEmailList(obj.webUserList);

                    //setReviewData(setProp(reviewData, "webUserId", obj.webUserList[0].webUserId));
                    console.log("set intial role id for web_user to be " + obj.webUserList[0].webUserId);

                    //action update currently not implemented
                    if (action === "update") {
                        fetch("review/getById?reviewId=" + id)
                            .then(response => response.json())
                            .then(data => {
                                console.log("Fetched review data:", data);
                                setReviewData(data);
                                setIsLoading(false);
                            })
                            .catch(error => {
                                console.error("Error fetching review:", error);
                                setIsLoading(false); // Ensure we stop loading even if there's an error
                            });
                        //true if insert selected
                    } else {
                        setIsLoading(false); // Stop loading immediately for inserting a new review
                    }
                }
            },
            function (ajaxErrorMsg) {
                setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
            }
        );

    }, []);


    const validate = () => {
        console.log("Validation kicking off ajax call");
        console.log("Here is the review data that will be sent to the insert/update API");
        console.log(reviewData);

        setIsLoading(true);
        ajax_alt(
            "review/" + action + "?jsonData=" + encodeUserInput(),

            function (obj) {
                console.log("These are the error messages (next line)");
                console.log(obj);

                if (obj.errorMsg.length === 0) {
                    // errorMsg = "" means no error, record was inserted (or updated). 
                    obj.errorMsg = "Record Saved !";
                }

                setErrorObj(obj); // show the field level error messages (will all be "" if record was inserted)
                setIsLoading(false);
            },

            function (ajaxErrorMsg) {
                setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                setIsLoading(false);
            }

        );
    };

    if (isLoading) {
        return <div> ... Loading ... </div>;
    }

    return (
        <table className="insertArea">
            <tbody>
                <tr>
                    <td>Review ID</td>
                    <td>
                        <input value={reviewData.reviewId} disabled />
                    </td>
                    <td className="error">
                        {errorObj.reviewId}
                    </td>
                </tr>
                <tr>
                    <td>User ID</td>
                    <td>
                        <input value={reviewData.webUserId} onChange=
                            {e => setReviewData(setProp(reviewData, "webUserId", e.target.value))}
                        disabled
                        />
                    </td>
                    <td className="error">
                        {errorObj.webUserId}
                    </td>
                </tr>
                <tr>
                    <td>Game Name</td>
                    <td>
                        <input value={reviewData.reviewGameName} onChange=
                            {e => setReviewData(setProp(reviewData, "reviewGameName", e.target.value))}
                        />
                    </td>
                    <td className="error">
                        {errorObj.reviewGameName}
                    </td>
                </tr>
                <tr>
                    <td>Game Image</td>
                    <td>
                        <input value={reviewData.gameImageUrl} onChange=
                            {e => setReviewData(setProp(reviewData, "gameImageUrl", e.target.value))}
                        />
                    </td>
                    <td className="error">
                        {errorObj.gameImageUrl}
                    </td>
                </tr>
                <tr>
                    <td>User Review</td>
                    <td>
                        <input value={reviewData.userReview} onChange=
                            {e => setReviewData(setProp(reviewData, "userReview", e.target.value))}
                        />
                    </td>
                    <td className="error">
                        {errorObj.userReview}
                    </td>
                </tr>
                <tr>
                    <td>User Rating</td>
                    <td>
                        <select value={reviewData.userRating} onChange={e => setReviewData(prev => ({ ...prev, userRating: e.target.value }))}>
                            {ratingList.map(rating => <option key={rating} value={rating}>{rating}</option>)}
                        </select>
                    </td>
                    <td className="error">{errorObj.userRating}</td>
                </tr>
                <tr>
                    <td>Game Price</td>
                    <td>
                        <input value={reviewData.gamePrice} onChange=
                            {e => setReviewData(setProp(reviewData, "gamePrice", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.gamePrice}</td>
                </tr>
                <tr>
                    <td>User Playtime (hours)</td>
                    <td>
                        <input value={reviewData.userPlaytime} onChange=
                            {e => setReviewData(setProp(reviewData, "userPlaytime", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.userPlaytime}</td>
                </tr>
                <tr>
                    <td>Game Genre</td>
                    <td>
                        <select value={reviewData.gameGenre} onChange=
                            {e => setReviewData(setProp(reviewData, "gameGenre", e.target.value))}>
                            {genreList.map(genre => <option key={genre} value={genre}>{genre}</option>)}
                        </select>
                    </td>
                    <td className="error">{errorObj.gameGenre}</td>
                </tr>
                <tr>
                    <td>User Email</td>
                    <td>
                        <select onChange=
                            {e => setReviewData(setProp(reviewData, "webUserId", e.target.value))}
                            value={reviewData.webUserId}
                        >
                            <option value="">Select your email:</option>
                            {
                                emailList.map(email => 
                                    <option key={email.webUserId} value={email.webUserId}>
                                        {email.userEmail}
                                    </option>
                                )
                            }

                        </select>
                    </td>
                    <td className="error">{errorObj.userEmail}</td>
                </tr>


                <tr>
                    <td colSpan="3">
                        <button onClick={validate}>Save Review</button>
                    </td>
                </tr>
                <tr>
                    <td colSpan="3" className="error">{errorObj.errorMsg}</td>
                </tr>
            </tbody>
        </table>
    );
};

/*
Example of review StringData output from review API

"reviewId": "1",
"webUserId": "1",
"reviewGameName": "Destiny 2",
"gameImageUrl": "https://i.ebayimg.com/images/g/sMcAAOSwVAhiItMQ/s-l400.jpg",
"userReview": "Good game but horrible developers.",
"userRating": "4",
"gamePrice": "$0.00",
"userPlaytime": "2,100.3",
"gameGenre": "RPG",
"userEmail": "joshuaslootsky@gmail.com",
"errorMsg": ""


*/


/*

"use strict";

const ReviewInsertOrUpdate = (props) => {
    // Determine insert vs. update
    let action = "insert";
    let id = "";
    const url = props.location.pathname;
    console.log("url that invoked ReviewInsertOrUpdate is", url);
    if (url.includes(":")) {
        const parts = url.split(":");
        id = parts[parts.length - 1];
        console.log("to update id", id);
        action = "update";
    } else {
        console.log("to insert");
    }

    // form data
    const [reviewData, setReviewData] = React.useState({
        reviewId: "",
        webUserId: "",
        reviewGameName: "",
        gameImageUrl: "",
        userReview: "",
        userRating: "",
        gamePrice: "",
        userPlaytime: "",
        gameGenre: "",
        userEmail: "",
        errorMsg: ""
    });

    // dropdown lists
    const [genreList, setGenreList] = React.useState([]);
    const [ratingList, setRatingList] = React.useState([]);
    const [emailList, setEmailList] = React.useState([]);

    // error messages
    const [errorObj, setErrorObj] = React.useState({
        reviewId: "",
        webUserId: "",
        reviewGameName: "",
        gameImageUrl: "",
        userReview: "",
        userRating: "",
        gamePrice: "",
        userPlaytime: "",
        gameGenre: "",
        userEmail: "",
        errorMsg: ""
    });

    // loading flags
    const [isLoadingEmailList, setIsLoadingEmailList] = React.useState(true);
    const [isLoadingReview, setIsLoadingReview] = React.useState(true);
    const [isLoadingSaveResponse, setIsLoadingSaveResponse] = React.useState(false);

    // helpers
    const setProp = (obj, key, val) => ({ ...obj, [key]: val });

    const encodeReviewInput = () => {
        const payload = {
            reviewId: reviewData.reviewId,
            webUserId: reviewData.webUserId,
            reviewGameName: reviewData.reviewGameName,
            gameImageUrl: reviewData.gameImageUrl,
            userReview: reviewData.userReview,
            userRating: reviewData.userRating,
            gamePrice: reviewData.gamePrice,
            userPlaytime: reviewData.userPlaytime,
            gameGenre: reviewData.gameGenre,
            userEmail: reviewData.userEmail
        };
        console.log("reviewInputObj:", payload);
        return encodeURI(JSON.stringify(payload));
    };

    // on mount: fetch email list + genre + rating, then (if update) fetch review
    React.useEffect(() => {
        console.log("AJAX call for user (email) list + genre + rating");
        ajax_alt("webUser/getAll",
            (obj) => {
                console.log("webUser/getAll success", obj);
                if (obj.dbError && obj.dbError.length > 0) {
                    setErrorObj(prev => setProp(prev, "userEmail", obj.dbError));
                } else {
                    setEmailList(obj.emailList);
                    setGenreList(obj.genreList);
                    setRatingList(obj.ratingList);
                }
                setIsLoadingEmailList(false);
            },
            (ajaxError) => {
                setErrorObj(prev => setProp(prev, "errorMsg", ajaxError));
                setIsLoadingEmailList(false);
            }
        );

        if (action === "update") {
            console.log("Fetching existing review", id);
            ajax_alt(`review/getById?reviewId=${id}`,
                (obj) => {
                    console.log("review/getById success", obj);
                    if (obj.errorMsg && obj.errorMsg.length > 0) {
                        setErrorObj(prev => setProp(prev, "errorMsg", obj.errorMsg));
                    } else {
                        setReviewData(obj);
                    }
                    setIsLoadingReview(false);
                },
                (ajaxError) => {
                    setErrorObj(prev => setProp(prev, "errorMsg", ajaxError));
                    setIsLoadingReview(false);
                }
            );
        } else {
            // insert case: no fetch needed
            setIsLoadingReview(false);
        }
    }, [action, id]);

    const validate = () => {
        console.log("Save review, action =", action);
        setIsLoadingSaveResponse(true);

        ajax_alt(`review/${action}?jsonData=${encodeReviewInput()}`,
            (obj) => {
                console.log("Save response:", obj);
                if (!obj.errorMsg || obj.errorMsg.length === 0) {
                    obj.errorMsg = "Record Saved!";
                }
                setErrorObj(obj);
                setIsLoadingSaveResponse(false);
            },
            (ajaxError) => {
                setErrorObj(prev => setProp(prev, "errorMsg", ajaxError));
                setIsLoadingSaveResponse(false);
            }
        );
    };

    // loading guard
    if (isLoadingEmailList || isLoadingReview || isLoadingSaveResponse) {
        return <div>… Loading …</div>;
    }

    return (
        <table className="insertArea">
            <tbody>
                <tr>
                    <td>Review ID</td>
                    <td><input value={reviewData.reviewId} disabled /></td>
                    <td className="error">{errorObj.reviewId}</td>
                </tr>
                <tr>
                    <td>User Email</td>
                    <td>
                        <select
                            value={reviewData.webUserId}
                            onChange={e => setReviewData(setProp(reviewData, "webUserId", e.target.value))}
                        >
                            <option value="">Select an email</option>
                            {emailList.map(item => (
                                <option key={item.webUserId} value={item.webUserId}>
                                    {item.userEmail}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className="error">{errorObj.webUserId}</td>
                </tr>
                <tr>
                    <td>Game Name</td>
                    <td>
                        <input
                            value={reviewData.reviewGameName}
                            onChange={e => setReviewData(setProp(reviewData, "reviewGameName", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.reviewGameName}</td>
                </tr>
                <tr>
                    <td>Game Image URL</td>
                    <td>
                        <input
                            value={reviewData.gameImageUrl}
                            onChange={e => setReviewData(setProp(reviewData, "gameImageUrl", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.gameImageUrl}</td>
                </tr>
                <tr>
                    <td>User Review</td>
                    <td>
                        <input
                            value={reviewData.userReview}
                            onChange={e => setReviewData(setProp(reviewData, "userReview", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.userReview}</td>
                </tr>
                <tr>
                    <td>User Rating</td>
                    <td>
                        <select
                            value={reviewData.userRating}
                            onChange={e => setReviewData(setProp(reviewData, "userRating", e.target.value))}
                        >
                            <option value="">Select a rating</option>
                            {ratingList.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </td>
                    <td className="error">{errorObj.userRating}</td>
                </tr>
                <tr>
                    <td>Game Price</td>
                    <td>
                        <input
                            value={reviewData.gamePrice}
                            onChange={e => setReviewData(setProp(reviewData, "gamePrice", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.gamePrice}</td>
                </tr>
                <tr>
                    <td>Playtime (hrs)</td>
                    <td>
                        <input
                            value={reviewData.userPlaytime}
                            onChange={e => setReviewData(setProp(reviewData, "userPlaytime", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.userPlaytime}</td>
                </tr>
                <tr>
                    <td>Genre</td>
                    <td>
                        <select
                            value={reviewData.gameGenre}
                            onChange={e => setReviewData(setProp(reviewData, "gameGenre", e.target.value))}
                        >
                            <option value="">Select a genre</option>
                            {genreList.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </td>
                    <td className="error">{errorObj.gameGenre}</td>
                </tr>
                <tr>
                    <td colSpan="3">
                        <button onClick={validate}>Save Review</button>
                    </td>
                </tr>
                <tr>
                    <td colSpan="3" className="error">{errorObj.errorMsg}</td>
                </tr>
            </tbody>
        </table>
    );
};

/*
Example of review StringData output from review API

"reviewId": "1",
"webUserId": "1",
"reviewGameName": "Destiny 2",
"gameImageUrl": "https://i.ebayimg.com/images/g/sMcAAOSwVAhiItMQ/s-l400.jpg",
"userReview": "Good game but horrible developers.",
"userRating": "4",
"gamePrice": "$0.00",
"userPlaytime": "2,100.3",
"gameGenre": "RPG",
"userEmail": "joshuaslootsky@gmail.com",
"errorMsg": ""


*/
