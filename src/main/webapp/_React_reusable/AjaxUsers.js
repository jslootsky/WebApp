"use strict"

const AjaxUsers = (url) => {

    console.log("AjaxUsers running");

    // Tell React that 'items' (an array of objects) is a state variable 
    // that (when changed) should redisplay this component.
    // Set its initial value to [], an empty array.
    const [items, setItems] = React.useState([]);

    // Tell React that "error" is a state variable that (when changed) 
    // should redisplay this component. Set its initial value to null.
    const [error, setError] = React.useState(null);

    const [isLoading, setIsLoading] = React.useState(true);

    const [displayedList, setDisplayedList] = React.useState([]);
    //state to store the list that will be displayed after filtering/sorting
    const [filterInput, setFilterInput] = React.useState("");
    //state to hold the filter input value 

    // useEffect 2nd parameter is an array of elements that 
    // (if any of those state variables change) should trigger the function specified 
    // as the 1st useEffect parameter. 
    // RUN ONCE PATTERN: If you put [] as 2nd param, it runs the 1st param (fn) once. 
    React.useEffect(() => {

        // ajax_alt takes three parameters: the URL to read, Success Fn, Failure Fn.
        ajax_alt(
            url, // URL for AJAX call to invoke
            //"json/users.json", // URL for AJAX call to invoke
            //"webUser/getAll", // URL for AJAX call to invoke

            // success function (anonymous)
            function (displayedList) {   // success function gets obj from ajax_alt
                if (displayedList.dbError.length > 0) {
                    setError(displayedList.dbError);
                } else {
                    console.log("in AjaxUsers, here is web user list (on the next line):");
                    console.log(displayedList.webUserList);
                    setItems(displayedList.webUserList);
                    setDisplayedList(displayedList.webUserList);
                    //initializes the displayed list with the full data
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

    //filtering funciton to update displayedList based on filterInput
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

    if (isLoading) {
        console.log("Is Loading...");
        return <div> Loading... </div>
    }

    if (error) {
        console.log("Error...");
        return <div>Error: {error} </div>;
    }

    console.log("items for UserTable on next line");
    console.log(items);
    return (
        <div className="clickSort">
            <h3>
                Web User List <br></br>
                {/* Input field for filtering by email */}
                <input value={filterInput} onChange={(e) => {
                    setFilterInput(e.target.value);
                }}
                    placeholder="Filter by email"
                />
                &nbsp;
                {/* Button to apply the filter explicity */}
                <button onClick={() => doFilter(filterInput)}>Search</button>
                &nbsp;
                {/* button to clear the filter and reset the list */}
                <button onClick={clearFilter}>Clear</button>
            </h3>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => sortByProp("userEmail", "text")}>
                            <img src="icons/sortUpDown16.png" alt="sort" /> Email
                        </th>

                        <th className="textAlignCenter">Image</th>

                        <th onClick={() => sortByProp("birthday", "date")}
                            className="textAlignCenter">
                            <img src="icons/blackSort.png" alt="sort" /> Birthday
                        </th>

                        <th onClick={() => sortByProp("membershipFee", "number")}
                            className="textAlignRight">
                            <img src="icons/whiteSort.png" alt="sort" /> Membership Fee
                        </th>

                        <th onClick={() => sortByProp("userRoleType", "text")}>
                            <img src="icons/sortUpDown16.png" alt="sort" /> Role
                        </th>

                        <th>Error</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        displayedList.map((item, index) =>
                            <tr key={item.webUserId}>
                                <td>{item.userEmail}</td>
                                <td className="shadowImage textAlignCenter"><img src={item.userImage} /></td>
                                <td className="textAlignCenter">{item.birthday}</td>
                                <td className="textAlignRight">{item.membershipFee}</td>
                                <td className="nowrap">{item.userRoleId} {item.userRoleType}</td>
                                <td>{item.errorMsg}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );

}; // function AjaxUsers 