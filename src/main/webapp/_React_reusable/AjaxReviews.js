"use strict"

const AjaxReviews = (url) => {

    console.log("AjaxReviews running");

    const [items, setItems] = React.useState([]);

    const [error, setError] = React.useState(null);

    const [isLoading, setIsLoading] = React.useState(true);

    const [displayedList, setDisplayedList] = React.useState([]);
    //state to store the list that will be displayed after filtering/sorting
    const [filterInput, setFilterInput] = React.useState("");
    //state to hold the filter input value 

    React.useEffect(() => {
        ajax_alt(
            url, // URL for AJAX call to invoke
            //"json/users.json", // URL for AJAX call to invoke
            //"webUser/getAll", // URL for AJAX call to invoke

            // success function (anonymous)
            function (displayedList) {   // success function gets obj from ajax_alt
                if (displayedList.dbError.length > 0) {
                    setError(displayedList.dbError);
                } else {
                    console.log("in AjaxReviews, here is review list (on the next line):");
                    console.log(displayedList.reviewList);
                    setItems(displayedList.reviewList);
                    setDisplayedList(displayedList.reviewList);
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

    const doFilter = (filterInputVal) => {
        let newList = filterObjList(displayedList, filterInputVal);
        console.log("function doFilter. filterInputVal is: " + filterInputVal +
            ". See filtered list on next line:");
        console.log(newList);
        setDisplayedList(newList);
    };

    const clearFilter = () => {
        setFilterInput("");
        setDisplayedList(items);
    }

    function sortByProp(propName, sortType) {
        // sort the user list based on property name and type
        jsSort(displayedList, propName, sortType);
        console.log("Sorted list is below");
        console.log(displayedList);

        let listCopy = JSON.parse(JSON.stringify(displayedList));
        setDisplayedList(listCopy);
    }

    function callInsert() {
        window.location.hash = "#/reviewInsert";
    }

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
                Review List &nbsp;
                <img src="icons/insert.png" onClick={callInsert} />
                <br></br>
                <input value={filterInput} onChange={(e) => {
                    setFilterInput(e.target.value);
                }}
                    placeholder="Filter by game name"
                />
                &nbsp;
                <button onClick={() => doFilter(filterInput)}>Search</button>
                &nbsp;
                <button onClick={clearFilter}>Clear</button>
            </h3>
            <table>
                <thead>
                    <tr>
                        <th></th> {/* column for the update button */}

                        <th onClick={() => sortByProp("reviewId", "number")}>
                            <img src="icons/sortUpDown16.png" alt="sort" /> Review Id
                        </th>

                        <th onClick={() => sortByProp("webUserId", "number")}>
                            <img src="icons/sortUpDown16.png" alt="sort" /> Web User Id
                        </th>

                        <th onClick={() => sortByProp("reviewGameName", "text")}>
                            <img src="icons/sortUpDown16.png" alt="sort" /> Email
                        </th>

                        <th className="textAlignCenter">Game Image</th>

                        <th>Review</th>

                        <th onClick={() => sortByProp("userRating", "number")}
                            className="textAlignRight">
                            <img src="icons/sortUpDown16.png" alt="sort" /> Rating
                        </th>

                        <th onClick={() => sortByProp("gamePrice", "number")}
                            className="textAlignRight">
                            <img src="icons/sortUpDown16.png" alt="sort" /> Price
                        </th>

                        <th onClick={() => sortByProp("userPlaytime", "number")}
                            className="textAlignRight">
                            <img src="icons/sortUpDown16.png" alt="sort" /> Playtime
                        </th>

                        <th onClick={() => sortByProp("gameGenre", "text")}>
                            <img src="icons/sortUpDown16.png" alt="sort" /> Genre
                        </th>

                        <th onClick={() => sortByProp("userEmail", "text")}>
                            <img src="icons/sortUpDown16.png" alt="sort" /> Email
                        </th>

                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        displayedList.map((item, index) =>
                            <tr key={item.reviewId}>
                                <td>
                                    <a href={'#/reviewUpdate/:' + item.reviewId}><img src="icons/update.png" className="clickLink" /></a>
                                </td>
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