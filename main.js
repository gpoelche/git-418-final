// George Poelcher III - 4/22/26 - GIT 418 - Prof. Bailey
"use strict";

// Declaring constants to be used in URLs for Postman requests
const postman = "https://1b068125-bd22-44a8-bc6d-6083f7cb4872.mock.pstmn.io";
const baseData = postman + "/champ_data";
const champData = baseData + "/champions";
const skinData = baseData + "/skins";

// The script waits for the DOM to load before submitting fetch requests to dynamically load certain content.
document.addEventListener("DOMContentLoaded", async function(){
    let response = await fetch(baseData);
    let data = await response.json();
    console.log(data);

    for(let champ of data.champions){
        let temp = `<div class='champCard'>`;
        temp += `<img src='${champ.splash_link}' alt='An image of the champion ${champ.name}'><h3>${champ.name}</h3><p>${champ.subtitle}</p><p>${champ.role}</p>`;
        temp += `</div>`;
        document.querySelector("#champions div").innerHTML += temp;
    }
});

