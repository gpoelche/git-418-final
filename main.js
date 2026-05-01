// George Poelcher III - 4/22/26 - GIT 418 - Prof. Bailey
"use strict";

// The script waits for the DOM to load before submitting fetch requests to dynamically load certain content.
document.addEventListener("DOMContentLoaded", async function(){

    //Check if the user has selected a region before, display the region select pop-up if not.
    if(!localStorage.getItem("region")){
        document.getElementById("popup-wrapper").classList.remove("hidden");
    }

    // Declaring constants to be used in URLs for Postman requests
    const postman = "https://1b068125-bd22-44a8-bc6d-6083f7cb4872.mock.pstmn.io";
    const baseData = postman + "/champ_data";
    
    let response = await fetch(baseData);
    let data = await response.json();

    //Adding champions from the fetch request into the DOM as cards that will cycle via Cycle2
    for(let champ of data.champions){
        let temp = `<div class='champCard'>`;
        temp += `<img src='${champ.splash_link}' alt='An image of the champion ${champ.name}'><div><h3>${champ.name}</h3><p>${champ.subtitle}</p><p>${champ.role}</p></div></div>`;
        document.querySelector("#championSlick").innerHTML += temp;
    }

    //Adding skins from the fetch request into the DOM as cards that will cycle via slick
    for(let skin of data.skins){
        let temp = `<div class='skinCard'>`;
        temp += `<img src='${skin.splash_link}' alt='An image of the skin ${skin.name}'><div><h3>${skin.name}</h3><p>Skinline: ${skin.skinline}</p></div></div>`;
        document.querySelector("#skins div").innerHTML += temp;
    }

    //Initializing all jQuery plugins that are on this page now that all data has been loaded for the dynamically added containers
    //Loads each of the plugins in the order that they appear within the website's content flow.
    $(function(){
        $("#tabs").tabs();

        $("#championSlick").slick({
            slidesToShow: 1,
            autoplay: true,
            arrows: true,
            prevArrow: '<button class="slick-prev">&larr;</button>',
            nextArrow: '<button class="slick-next">&rarr;</button>'
        });

        $("#skinSlick").slick({
            slidesToShow: 1,
            autoplay: true,
            arrows: true,
            prevArrow: '<button class="slick-prev">&larr;</button>',
            nextArrow: '<button class="slick-next">&rarr;</button>'
        });
    });
});

// Form functions
function setRegion(e){
    e.preventDefault();
    let region = document.querySelector("#region").value;
    localStorage.setItem("region", region);
    document.querySelector("#popup-wrapper").classList.add("hidden");
}

//Function for making call to Riot Games API
async function getPlayer(e){
    e.preventDefault();
    //The Riot Games API uses a mix of server/platform codes and routing region codes to request responses. 
    //I created a map to pair the values together so that I can pull the routing value from the region selected in the popup dialog.
    const routings = {
        //Routings for Americas
        "na1": "americas",
        "la1": "americas",
        "la2": "americas",
        "br1": "americas",

        //Routings for Europe
        "euw1": "europe",
        "eun1": "europe",
        "ru": "europe",

        //Routings for Asia
        "kr": "asia",
        "jp1": "asia"
    };

    const apiKey = 'RGAPI-76851bcc-3899-4f22-bc2c-c3fe41d5e6de';
    let playerContent = document.querySelector("#player-content");
    playerContent.innerHTML = "";
    
    //String is formatted for the api call url. Spaces in usernames are replaced with "%20" within the API call url according to the documentation.
    let name = document.querySelector("#playerSearch").value;
    let searchName = name.trim().replaceAll(" ", "%20");
    let region = localStorage.getItem("region");
    let platform = routings[region];

    //Taglines were introduced at one point to let players change this value and help differentiate users. Those with older accounts are assigned with the region code the account existed on.
    let tagline = region;

    //Changes the search parameters if a user wants to check for a player with a specific tagline value
    if(document.getElementById("taglineSearch").value.length > 0){
        tagline = document.getElementById("taglineSearch").value;
    }

    //URL that is sent to the Riot Games API with the Account-V1 function
    let accountUrl = `https://${platform}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${searchName}/${tagline}?api_key=${apiKey}`;    

    //Try block that catches bad responses from the user request. Adds the error message to an error span.
    try{
        let response = await fetch(accountUrl);    
        document.querySelector("#searchForm span").classList.add("hidden");

        if(!response.ok){
            //Case for is a user does not exist within the search parameters. 
            if(response.status == 404){
                throw "Player not found. Please check the search terms and try again!";
            }

            //Blanket error statement.
            else{
                throw "There was an error processing your request. Please try again later.";
            }
        }
        
        let acctInfo = await response.json();
        let puuid = acctInfo.puuid;
        //URL that is sent to the Riot Games API with the Summoner-V4 function
        let puuidUrl = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`;
        let userRes = await fetch(puuidUrl);
        let userInfo = await userRes.json();

        //Getting player ranked information, for solo queue only
        let rankUrl = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${apiKey}`;
        let rankRes = await fetch(rankUrl);
        let rankInfo = await rankRes.json();

        //Getting champion mastery info for the player with the puuid value on Champion Mastery-V4
        let masteryUrl = `https://${region}.api.riotgames.com/lol/champion-mastery/v4/scores/by-puuid/${puuid}?api_key=${apiKey}`;
        let masteryRes = await fetch(masteryUrl);
        let masteryInfo = await masteryRes.json();
        
        //Begins to build the player data that is returned in the player search section, loaded into two separate divs to format the section.
        let temp = `<div id="baseInfo"><img src='https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${userInfo.profileIconId}.jpg'>
        <h3>${searchName.replaceAll("%20", " ")}</h3>
        <p>Player Level ${userInfo.summonerLevel}</p>
        <p>Mastery Level ${masteryInfo}</p></div><div id="rankedInfo">`;

        // Images for the ranks in this section are from another version of DataDragon called CommunityDragon. It's maintained by game community members and a bit easier to use interface-wise
        //SVGs are loaded from there into the player section based on the string value of the tier returned in API call
        if(rankInfo.length == 0){
            temp += `<img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/unranked.svg">`;
            temp += `<h3>Ranked Stats</h3><p>Unranked</p>`;
        }

        else{
            if(rankInfo[0].tier == "MASTER" || rankInfo[0].tier == "GRANDMASTER" || rankInfo[0].tier == "CHALLENGER"){
                temp += `<img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${String(rankInfo[0].tier).toLowerCase()}.svg">`;
                temp += `<h3>Ranked Stats</h3><p>${rankInfo[0].tier} ${rankInfo[0].leaguePoints}LP</p>`;
            }

            else{
                temp += `<img src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${String(rankInfo[0].tier).toLowerCase()}.svg">`;
                temp += `<h3>Ranked Stats</h3><p>${rankInfo[0].tier} ${rankInfo[0].rank} ${rankInfo[0].leaguePoints}LP</p>`;
            }

            temp += `<p>${rankInfo[0].wins}W ${rankInfo[0].losses}L</p></div>`;
        }
        
        playerContent.innerHTML = temp;
    }

    catch(err){
        document.querySelector("#searchForm span").classList.remove("hidden");
        document.querySelector("#searchForm span").innerHTML = err;
    }

}

//Setting event listeners
document.getElementById("regionSelectButton").addEventListener("click", function(e){
    e.preventDefault();
    document.getElementById("popup-wrapper").classList.remove("hidden");
});

document.querySelector("#region-popup form").addEventListener("submit", setRegion);
document.querySelector("#find form").addEventListener("submit", getPlayer);