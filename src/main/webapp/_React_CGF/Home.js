"use strict"

function Home(){
    return(
        <div className = "home">
            <h2>Video Game Reviews</h2>

            <p>
                This is my website where I will put my personal ratings and reviews for games I have played. 
            </p>

            <p>
                This website is currently under construction but be sure to check back soon for my reviews!
                I will also add the ability for users to add their own reviews and ratings to these games!
            </p>

            <p>
                To view published server page, view the blog.
            </p>

            <p>
                Click 
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank"> here </a>
            </p>

            <div className="imageFlexContainer">
                <img src="pics/ea_origin_logo348x424.png" className="flexImage" alt="EA Origin Logo" />
                <img src="pics/epic_games_png800x800.png" className="flexImage" style={{width: '60%'}} alt="Epic Games Logo" />
                <img src="pics/steam_library686x386.jpg" className="mainImage" alt="Steam Library" />
                <img src="pics/steam_icon_png480x480.png" className="flexImage" alt="Steam Icon" />
                <img src="pics/gog_galaxy_icon_png512x512.png" className="flexImage" style={{width: '40%'}} alt="GOG Galaxy Icon" />
            </div>
        </div>
    );
}