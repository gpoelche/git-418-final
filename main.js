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
    console.log(data);

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
    alert(region);
    localStorage.setItem("region", region);
    document.querySelector("#region-popup").classList.add("hidden");
}

//Setting event listeners
document.querySelector("#region-popup form").addEventListener("submit", setRegion);
