"use strict"

function Blog() {
    return (
        <div className="blog">
            <h2>Blog</h2>

            <h3>Server Page</h3>

            <p>
                Click
                <a href="https://cis-linux2.temple.edu/tomcat10/sp25_3308_tun90969/hello" target="_blank"> here </a>
                to see my published server side page.
            </p>

            <h3>Proposed Database Table</h3>

            <p>
                My proposed database table is a list of reviews written by users.
                The database fields will contain:
                <ul>
                    <li>
                        Auto-incrementing primary key
                    </li>
                    <li>
                        Name of the Game (String)
                    </li>
                    <li>
                        A picture of the game cover (URL)
                    </li>
                    <li>
                        The user's rating out of five stars (Integer)
                    </li>
                    <li>
                        Price of the game (Currency)(Nullable)
                    </li>
                    <li>
                        User's playtime at the time of their review in hours (Float)(Nullable)
                    </li>
                    <li>
                        The game's genre (String)
                    </li>
                    <li>
                        Short paragraph explaining the user's review (String)
                    </li>
                    <li>
                        Foreign key to user table
                    </li>
                </ul>
                For my "pick list" table I can have the user search for reviews by rating (5 star, 4 star, etc.).
            </p>

            <p>
                Click
                <a href="docs\slootsky_database_la2.pdf" target="_blank"> here </a>
                to view my database design document.
            </p>

            <h3>My Database Experience</h3>

            <p>
                I took a database design and administration class in community college so I have experience
                with SQL and the basic principles of database design. However, outside of Microsoft Access and
                querying SQL databases, I have no development experience with databases.
            </p>

            <h3>My Web Development Experience</h3>

            <p>
                I have a very surface-level exposure to React and that is the extent to my web development experience.
            </p>

            <h3>HW1 Homepage</h3>

            <p>
                This homework took me a while as I went on many different tangents learning about HTML and CSS.
                I spent a long time fiddling with my homepage so I could get it to work the way I want it to.
                I am far from being finished and having it look how I want it to but I hope to continue adding to it in
                the future.
            </p>

            <h3>Database</h3>

            <p>
                I have a good grasp on the basics of databases and database management.
                In community college, I had the opportunity to take a database administration class where
                I had the opportunity to learn database theory such as relational algebra as
                well as learning SQL near the end. It was an excellent opportunity to
                familiarize myself with the basics so that I could then go on to apply them
                to other projects later into my learning.
            </p>

            <h3>HW3 Notes</h3>

            <p>
                Converting from pure html/css took forever as I spent ages
                trying to figure out how React.js works and how to effectively
                split my main css file into smaller css files that apply
                to individual CGFs. I have also completely altered the way
                my website looks. I decided to go to a more pleasant beige
                color scheme but I am still working on the nav bar to get
                it to a point where I am satisfied with it. However, I believe
                it looks much better than it did before. I changed the background
                color of the blog from gray to a darker beige color and it
                is much more pleasing to the eye.
            </p>

            <h3>HW4 Notes</h3>

            <p>
                Again, what seemed like a simple task of transferring what I did from lab 4 took much longer than expected.
                Most of it was confusion with the assignment as my design did not quite align with the instructed design.
                For example, the assignment said to have the parameters for my make function be an image and then a separate list of images
                alongside another descriptor. This confused me for a while and I at first thought that I was missing something but I just
                ended up implementing it anyways. I figured that simply having the first image be the main image and setting the default
                image to imgObjList[0].val would be simpler because if the user wanted to change the image and then change back to the
                default image, they wouldn't be able to unless the image address was placed as the first parameter and then one of the
                images in the image list.
            </p>

            <p>
                I hope that as I continue gaining more experince with HTML, CSS, JavaScript, and React that this will become less time-
                consuming. Much of my time is being spent fiddling with CSS as there are so many options and little values that can
                be adjusted. I never seem to be fully satisfied with the way my page looks so I end up just messing with the CSS most of the
                time.
            </p>

            <h3>HW5 Notes</h3>

            <p>
                To see my <strong>List Users API</strong> open up in a new tap, click
                <a href="webUser/getAll" target="_blank"> here</a><br></br>
                To see my <strong>Review API</strong> open up in a new tap, click
                <a href="review/getReviewGameName" target="_blank"> here</a>
            </p>

            <h4>Joshua Slootsky module 5</h4>

            <p>
                I wrote several server-side JDBC queries that access the SQL server on cis-linux 2
            </p>

            <p>
                I feel that this module greatly broadened my knowledge of web app development and I now understand how web applications
                query servers and retrieve information. I've dealt with simple SQL queries in MySQL workbench but I did not know
                the extent of preparation required to have a webapp query a database. This material felt fairly straightforward to me as
                I understand how each piece of the query builds off of one another so the material was not that difficult.
            </p>

            <p>
                I have also attached documentation for possible errors that may arise when working with databases in web applications
                <a href="docs\query_errors.pdf" target="_blank"> here</a>.
            </p>

            <h3>HW6 Notes</h3>

            <p>
                I found homework 6 to be fairly straightforward if not slightly time consuming since I had a few typos and bugs along the way.
                I also added a bunch of new entries into the database so it should have almost double the user base. I did most of the work
                in the lab activity for this module so it was basically copying over what I did from my lab while also
                implementing the filtering and sorting functionality given by the provided code.
            </p>

            <h3>HW7 Notes</h3>

            <p>
                The usual trend when it comes to these types of assignments is that whenever I come back to it after not working on it for a little,
                nothing makes sense. I've attempted to curb this by writing more comments explaining what I am doing but I think that will be a
                persistent issue. This is the main reason as to why this assignment took me longer than it should have. Remembering what I learned
                from the lab activity and applying it to the main homework took some carefuly study of the code but I eventually figured out
                what I was doing. It was satisfying to be able to implement everything I wanted with the login, the session, and logging out, but
                it all came together in the end.
            </p>

            <h3>HW8 Notes</h3>

            <p>
                This assignment was a challenging but rewarding experience as I worked through the process of dynamically
                populating the user email dropdown based on data retrieved from an API. Initially, I struggled with understanding
                how the user role dropdown was implemented, and I spent a significant amount of time analyzing the existing code
                to see how the logic could be adapted for the email selection. Relearning certain JavaScript and React concepts,
                such as state management and asynchronous data fetching, was essential to making progress. After several attempts
                and debugging sessions, I was finally able to implement the required API calls, correctly process the returned data,
                and integrate it into the UI. The sense of accomplishment I felt after seeing the email dropdown populate correctly
                made the effort worthwhile, and I now feel much more confident in my ability to handle similar challenges in the future.
            </p>
        </div>
    );
}