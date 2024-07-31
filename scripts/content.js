
const article = document.querySelector("article");

if (article) {
    let list = article.querySelectorAll("p");
    for (let i = 0; i < list.length; i++) {

        //set up pin button
        let pinned = false;
        const pin = document.createElement("button");
        pin.className = "shadowbtn";
        const icon = document.createElement("img");
        icon.src = chrome.runtime.getURL("assets/pushpin-fill-24.png");
        pin.appendChild(icon);
        pin.onclick = function()
        {
            pinned = !pinned;
            if (pinned) {
                icon.src = chrome.runtime.getURL("assets/unpin-fill-24.png");
            } else {
                icon.src = chrome.runtime.getURL("assets/pushpin-fill-24.png");
            }
        }

        //shadowdom setup: identify src
        let src = list[i];

        //calculate wordcount
        let countdisplay = false;
        const words = src.textContent.matchAll(/[^\s]+/g);
        const wordCount = [...words].length;
        const countel = document.createElement("span");
        countel.className = "wordcount";
        countel.textContent =  `${wordCount} words`;

        //note: shadowDOM 'hides' lightDOM. re-inject contents like below or use "<slot></slot>" to display lightDOM
        const basediv = document.createElement("div");
        basediv.className = "basediv";
        basediv.textContent = src.textContent;

        //attach shadowdom to src
        const shadow = src.attachShadow({mode: "open"});
        shadow.innerHTML = `<link rel="stylesheet" href="` + chrome.runtime.getURL("css/style.css") + `" />`
        shadow.appendChild(basediv);
        
        //when hovering over a non-pinned p, change bg and display pin button
        list[i].addEventListener(
            'mouseenter', 
            (e) => {
                if (!pinned) {
                    basediv.style.backgroundColor = "#FFE550";
                    basediv.appendChild(pin);
                }
            });

        //when leaving hover over a non-pinned p, revert bg and remove pin button
        list[i].addEventListener(
            'mouseleave', 
            (e) => {
                if (!pinned) {
                    basediv.style.backgroundColor = "";
                    basediv.removeChild(basediv.lastElementChild);
                }
                //note: shadowDOMs cannot be destroyed, so instead we just make it identical to the lightDOM            
            });

        //on click on pinned p, toggle wordcount display
        list[i].addEventListener(
            'click',
            (e) => {
                if (pinned) {
                    //toggle wordcount
                    //this triggers on initial click to pin: i'm leaving that behaviour intentionally
                    countdisplay = !countdisplay;
                    if (countdisplay) {
                        basediv.appendChild(countel)
                    } else {
                        basediv.removeChild(basediv.lastElementChild);   
                    }
                } else if (countdisplay) {
                    //if not pinned but countdisplay, p was just unpinned-- clear and reset countdisplay
                    countdisplay = false;
                    basediv.removeChild(basediv.lastElementChild);
                }
            });
    }
} else {
    console.log("NO ARTICLE")
}