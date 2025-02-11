"use strict"
//image file name (default), list of objects with image file names and display names (options), 
// at least one non character property, and at least one other property

//first image is the game cover, alternate images are other promotional material
//the game cover will be included as the first element in the image object list

/*Format
(Game Name)
(Game Image) - starts off with default image
(image description) - takes the text of the image drop down option
User Rating: (user rating) - starts off with default rating
Change Image: (drop down with image descriptions) - changes the image
Change Rating: (drop down with different rating options) - changes the user rating
*/
function MakeReview({
    defaultImg = "undefined",
    imgObjList = [{"display": "image not specified", "val": "undefined", "description": "description not specified"}],
    userRating = "1",
    gameName = "name not given"
}){
    var ratings = ["1", "2", "3", "4", "5"];//ratings can only be 1 through 5
    var reviewObj = document.createElement("div");//DOM element to return
    reviewObj.classList.add("review");

    var displayImg = defaultImg;//serves as placeholder for image to display
    var imgDescription = imgObjList[0].description;//sets image description to the first value in the list by default

    reviewObj.innerHTML = `
        <h1>${gameName}</h1>
        <img src ='${displayImg}' class="gameImg">
        <div id="review-content">
            <h3 class="imgDescription">${imgDescription}</h3>
            User Rating: <span class="userRating">${userRating}</span><br/>
            Change Image: <select class="selectImageC"></select><br/>
            Change Rating: <select class="selectRatingC"></select>
        </div>
    `;

    var gameImage = reviewObj.getElementsByClassName("gameImg")[0];//gets the game image element
    var imageDescriptionElem = reviewObj.getElementsByClassName("imgDescription")[0];//gets the image description element
    var userRatingElem = reviewObj.getElementsByClassName("userRating")[0];//gets the rating display
    var selectImage = reviewObj.getElementsByClassName("selectImageC")[0];//gets the image drop down to manipulate
    var selectRating = reviewObj.getElementsByClassName("selectRatingC")[0];//gets the rating drop down to manipulate

    
    //populating rating dropdown (1, 2, 3, 4, 5)
    for (var rating of ratings){
        var opt = document.createElement("option");
        opt.innerHTML = rating;//display text
        opt.value = rating;//value of selection
        selectRating.appendChild(opt);
    }

    selectRating.value = userRating;//sets the initial dropdown value to the value entered by the consumer

    //put the options into the select tag from imgObjList
    for (var listEle of imgObjList){
        var opt = document.createElement("option");
        opt.innerHTML = listEle.display;//display text
        opt.value = listEle.val;//drop down value
        opt.setAttribute("data-description", listEle.description);//attach an attribute to each dropdown
        selectImage.appendChild(opt);
    }

    selectImage.value = defaultImg;//sets the default select coniditon to the default image 

    // Event listener for changing the image
    selectImage.addEventListener("change", function () {
        var selectedOption = selectImage.options[selectImage.selectedIndex];
        gameImage.src = selectedOption.value; // Update image source
        imageDescriptionElem.textContent = selectedOption.getAttribute("data-description"); // Update image description
    });

    selectRating.addEventListener("change", function () {
        userRatingElem.textContent = selectRating.value; //update rating display
    });

    reviewObj.addEventListener("mouseover", function () {
        reviewObj.classList.add("review-hover");//change background color on hover
    });

    //event listener for mouseout to reset the background color
    reviewObj.addEventListener("mouseout", function () {
        reviewObj.classList.remove("review-hover");//reset background color when mouse leaves
    });

    return reviewObj; //return the completed review element
}