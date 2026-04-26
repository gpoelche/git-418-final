// George Poelcher III - 4/22/26 - GIT 418 - Prof. Bailey
"use strict";

// The script waits for the DOM to load before submitting fetch requests to dynamically load certain content.
document.addEventListener("DOMContentLoaded", async function(){

    //Check if the user has selected a region before, display the region select pop-up if not.
    if(!localStorage.getItem("region")){
        document.getElementById("region-popup").classList.remove("hidden");
    }

    // Declaring constants to be used in URLs for Postman requests
    const postman = "https://1b068125-bd22-44a8-bc6d-6083f7cb4872.mock.pstmn.io";
    const baseData = postman + "/champ_data";
    
    let response = await fetch(baseData);
    let data = await response.json();

    //Adding champions from the fetch request into the DOM as cards that will cycle via Cycle2
    for(let champ of data.champions){
        let temp = `<div class='champCard'>`;
        temp += `<img src='${champ.splash_link}' alt='An image of the champion ${champ.name}'><h3>${champ.name}</h3><p>${champ.subtitle}</p><p>${champ.role}</p></div>`;
        document.querySelector("#champions div").innerHTML += temp;
    }

    //Adding skins from the fetch request into the DOM as cards that will cycle via slick
    for(let skin of data.skins){
        let temp = `<div class='skinCard'>`;
        temp += `<img src='${skin.splash_link}' alt='An image of the skin ${skin.name}'><h3>${skin.name}</h3><p>${skin.skinline}</p></div>`;
        document.querySelector("#skins div").innerHTML += temp;
    }
});

// Form functions
function setRegion(e){
    e.preventDefault();
    let region = document.querySelector("#region").value;
    localStorage.setItem("region", region);
    document.querySelector("#region-popup").classList.add("hidden");
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

    const apiKey = 'RGAPI-347c3cce-9af8-45dc-bc85-7f3cdcff06de';
    let name = document.querySelector("#playerSearch").value;

    //String is formatted for the api call url. Spaces in usernames are replaced with "%20" within the API call url according to the documentation.
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

    let response = await fetch(accountUrl);
    if(response.status == 200){
        let acctInfo = await response.json();
        let puuid = acctInfo.puuid;
        //URL that is sent to the Riot Games API with the Summoner-V4 function
        let puuidUrl = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`;

        let userRes = await fetch(puuidUrl);
        let userInfo = await userRes.json();
        console.log(userInfo);
    }

    else{
        alert("BAD RESPONSE: TRY AGAIN");
    }
}

//Setting event listeners
document.getElementById("regionSelectButton").addEventListener("click", function(e){
    e.preventDefault();
    document.getElementById("region-popup").classList.remove("hidden");
});

document.querySelector("#region-popup form").addEventListener("submit", setRegion);
document.querySelector("#find form").addEventListener("submit", getPlayer);

