# League of Legends Homepage: A Study in API Integration 
## Objective
For this project, I was required to build a single-page site with a set width of 1280px for a brand or project that functioned like a real product. I was also required to fulfill course 
requirements based on the subject material of the class: making API calls, dynamically loading data into the DOM from fetch requests, utilizing jQuery plugins, accessing localStorage, 
and following development best practices (no errors in console, validated HTML/CSS, color accessibility compliance, etc.). With this page specifically, the goal was to encourage users to make 
an account and download League of Legends.

## Synopsis
The project features API calls to the Riot Games API which returns player data for League of Legends. This was inspired by existing tools that show players their in-game stats such as op.gg and u.gg.
My friends and I used these tools frequently while playing the game in high school, and I was seeking to partially recreate this type of product as a learning experience. My knowledge of the game was 
foundational in understanding the data returned by the API, which was a major factor in the success I found with this project.

## Process
I began by drafting wireframes of the website and each content area (hero section, maps, characters, skins, player search). From there, I completed all basic HTML that was required without relying on 
dynamically injected elements from JavaScript.
<br><br>
Afterwards, I began writing the scripts that initialized the jQuery plugins used in this project (Slick for the carousels and jQuery UI for the tabs 
section showing maps). With the carousels in place, I then utilized a custom Postman GET response to return character data and images that were used to load the content in the cards within image 
carousels. The last of the scripting work was focused on loading player data from the Riot Games API. After creating a developer account and gaining access to the API, I began writing code that checked 
the entered player name, selected region, and the player tag before sending a GET request to the API. This request would then return an ID attached to the player, which was then used to get the player’s 
details (icon, rank, win-loss ratio, etc.). 
<br><br>
Lastly, I spent the remaining project time styling the page to match the League of Legends brand aesthetic as closely as possible. I styled the page to be 
inline with the brand aesthetic, but made personal choices for the typography and certain colors used.

## Results
Overall, the project was completed with all requirements fulfilled. All plugins were successfully implemented, API calls properly returned requested player data, and the browser properly utilized 
localStorage to load the player’s selected region between page loads. Due to prioritizing the required script implementation and focusing on strong HTML foundations, the visual direction was simplified. 
If given more time, I would have preferred to further the page’s visual identity. You can view more details on this project's [Behance page.](https://www.behance.net/gallery/248662179/GIT-418-Final-League-of-Legends-Home-Page)

*[Note: This project’s API functionality does not currently work in the GitHub-hosted version. The free-tier developer key of the Riot Games API expires every 24 hours. 
Preferably, this project would also not store the API key in the script and instead perform a middleware request. Player data request functionality can be viewed on my Behance page.]*

## Gallery
<img width="1362" height="990" alt="unnamed" src="https://github.com/user-attachments/assets/a3076f74-7fc7-4947-9be1-7460ea844079" />
This is a screenshot of the hero section of the website. This redirects users to the download page for the game since this is theoretically attempting to convert traffic into installed players.
<br><br>
<img width="1365" height="990" alt="unnamed (1)" src="https://github.com/user-attachments/assets/3b30cc02-5ab9-4630-b9c2-0cb68b6a912a" />
This is a screenshot of the jQuery UI plugin utilized to show the user different maps that the game can be played on. This toggles between three different arenas with different game modes featured on each.
<br><br>
<img width="1371" height="1044" alt="unnamed (2)" src="https://github.com/user-attachments/assets/1f85c192-457a-4c25-9fdd-47c2c0e89618" />
This is an example of one of the image carousels added to the project. This was done utilizing Slick jQuery and features several cards that can be toggled through with the directional arrows.
