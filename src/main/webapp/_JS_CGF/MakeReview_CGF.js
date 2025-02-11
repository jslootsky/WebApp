/*
function MakeReview({
    defaultImg = "undefined",
    imgObjList = [{"display": "image not specified", val: "undefined"}],
    userRating = "1",
    gameName = "name not given"
})

conditionList: [
    { "display": "Excellent", "val": "5" },
    { "display": "Good", "val": "4" },
    { "display": "Fair", "val": "3" },
    { "display": "Poor", "val": "2" },
    { "display": "Unknown", "val": "1" }
],
*/
"use strict"
function MakeReview_CGF(){
    var ele = document.createElement("div");
    ele.classList.add("flex");

    var cs2Review = MakeReview({
        defaultImg : "pics/cs2_cover.jpg",
        imgObjList: [
            { "display": "Main Cover Photo", "val": "pics/cs2_cover.jpg", "description": "Official Counter-Strike 2 cover art" },
            { "display": "Alt Cover", "val": "pics/cs2_example_img_1.jpg", "description": "Alternative Cover Photo" },
            { "display": "CS:GO Cover", "val": "pics/cs2_example_img_2.png", "description": "Legacy cover photo from previous installment" },
            { "display": "CS:GO Promo", "val": "pics/cs2_example_img_3.jpg", "description": "Promotional artwork for CS:GO" }
        ], 
        userRating: "5",
        gameName: "Counter Strike 2"
    });

    var destiny2Review = MakeReview({
        defaultImg : "pics/d2_cover.jpg",
        imgObjList: [
            { display: "Main Cover Photo", val: "pics/d2_cover.jpg", description: "Official Destiny 2 cover art for The Final Shape" },
            { display: "Forsaken", val: "pics/d2_example_img_1.jpg", description: "Promotional artwork for Destiny 2: Forsaken" },
            { display: "Warmind", val: "pics/d2_example_img_2.jpg", description: "Artwork for Destiny 2: Warmind" },
            { display: "Concept Art", val: "pics/d2_example_img_3.jpg", description: "Concept art promoting the release of Destiny 2" }
        ], 
        userRating: "3",
        gameName: "Destiny 2"
    });

    var maddenReview = MakeReview({
        defaultImg : "pics/madden_25_cover.jpg",
        imgObjList: [
            { display: "Main Cover Photo", val: "pics/madden_25_cover.jpg", description: "Official Madden 25 Cover" },
            { display: "Deluxe", val: "pics/madden_25_example_1.jpg", description: "Madden 25 Deluxe Cover" },
            { display: "Alternate", val: "pics/madden_25_example_2.jpg", description: "Madden 25 MyTeam Cover" },
            { display: "Gameplay", val: "pics/madden_25_example_3.jpg", description: "Madden 25 Gameplay Snapshot" }
        ], 
        userRating: "2",
        gameName: "Madden 25"
    });

    var emptyReview = MakeReview({});

    ele.appendChild(cs2Review);
    ele.appendChild(destiny2Review);
    ele.appendChild(emptyReview);
    ele.appendChild(maddenReview);

    return ele;
}