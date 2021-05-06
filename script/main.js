const container = document.querySelector(".items-container");

async function getVectors(uri) {
    const res = await fetch(uri).then((res) => res.json());
    const data = res.images;
    for (let i = data.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let final = ([data[i], data[j]] = [data[j], data[i]]);
        final.forEach((item) => {
            container.innerHTML += `<div class="items-st w-full h-auto md:h-36 bg-white relative overflow-hidden cursor-pointer p-5 transition ease-in-out duration-500 flex items-center justify-center" data-id="${item.id}" tabindex="0" role="button" aria-pressed="false">
              <img
                  src="./img/vectors/${item.path}"
                  class="max-w-full max-h-40 md:max-h-full object-cover"
                  alt="${item.name}"
              />
      </div>`;
        });

        activeAllFunctions();
    }
}

getVectors(`./script/images.json` || `${window.location.href}/script/images.json`);

function activeAllFunctions() {
    const items = document.querySelectorAll(".items-st");
    let arr = [];
    items.forEach((item) => {
        item.onclick = () => {
            let image = item.querySelector("img").src;

            item.classList.replace("items-st", "items-after-hidden");

            arr.push(...arr, item);

            let newItems = [...new Set(arr)];

            if (newItems.length === 2) {
                let firstItems = newItems[0];
                let lastItem = newItems[newItems.length - 1];
                if (
                    firstItems.querySelector("img").src ===
                    lastItem.querySelector("img").src
                ) {


                    setTimeout(() => {
                        newItems.forEach(it => it.setAttribute('aria-pressed', true));

                        firstItems.classList.add('hidden');
                        lastItem.classList.add('hidden');
                        arr = [], newItems = [];

                        pushSoundEffects(`${window.location.href}/assets/sounds/true.mp3` || `./assets/sounds/true.mp3`);
                    }, 250);

                } else {
                    setTimeout(() => {
                        newItems.forEach(not => not.classList.replace("items-after-hidden", "items-st"));
                        arr = [], newItems = [];
                        pushSoundEffects(`${window.location.href}/assets/sounds/false.mp3` || `./assets/sounds/false.mp3`);

                    }, 250);

                }
            }


        };
    });
}


function pushSoundEffects(uri) {
    let audio = new Audio(uri);
    audio.play();
}
const timer = document.querySelector('.timer-clock');

var totalSeconds = 0;
const timerEleme = document.querySelector('.timer-elem');

function setTime() {
    ++totalSeconds;
    timer.innerHTML = `<span class="mins-item">${pad(parseInt(totalSeconds / 60))}</span>:<span>${pad(totalSeconds % 60)}<span>`;

    let mins = document.querySelector('.mins-item');

    if (mins) {
        let stringToNumber = Number(mins.innerHTML);

        if (stringToNumber === 10) {
            return (clearInterval(interval), timer.innerHTML = "00:00", setAnotherTimer(), totalSeconds = 5);
        }
    }
}

function setAnotherTimer() {
    const popupConrtainer = document.querySelector('.popup-container');
    popupConrtainer.classList.remove('hidden');
    pushSoundEffects(`${window.location.href}/assets/sounds/over.mp3` || `./assets/sounds/over.mp3`);
    document.title = "Puzzle | Game over 😢";

    let popupInterVal = setInterval(() => {
        //check if total seconds var value is more than or equal 0 or not to be able decrease well. 
        totalSeconds > 0 ? --totalSeconds : 0;
        timerEleme.innerHTML = totalSeconds + "s";
    }, 1000);
    setTimeout(() => {
        window.location.reload();
        clearInterval(popupInterVal);
    }, 5000);
}



function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    }


    return valString;
}

// change emojis during loading using math random

const emojiItnerVal = setInterval(chaneImoji, 500);

function chaneImoji() {
    let emoji = document.querySelector('.emoji-icons');
    let emojis = ["😍", "😘", "😎", "😋", "🙄", "😗"];

    let rand = Math.floor(Math.random() * emojis.length);

    emoji.innerHTML = emojis[rand];
}

// cookies
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    const enableCookies = getCookie("cookies_enable");
    const cookiesContainer = document.querySelector('.cookies-container');

    enableCookies !== "" ? cookiesContainer.classList.add('hidden') : cookiesContainer.classList.remove('hidden');

    cookiesContainer.querySelector('button').onclick = () => {
        setCookie('cookies_enable', true, 30);
        cookiesContainer.classList.add('hidden');
        window.location.reload();
    }

    Boolean(getCookie('cookies_enable')) ? checkAnotherDataSaved() : checkCookie();

}

checkCookie();



function checkAnotherDataSaved() {
    const loaderContainer = document.querySelector('.loader-container');
    const summaryContrainer = document.querySelector('.summary-container');
    const cookisName = getCookie('name');
    const cookisEmail = getCookie('email');

    summaryContrainer.querySelector('#share').value = window.location.origin;

    summaryContrainer.querySelector('#share').onclick = ({ target }) => {
        target.select();
        document.execCommand("copy");
        // console.log(target.value);

        let copied = target.parentElement.querySelector('span');
        copied.classList.remove('opacity-0', 'transform-y-1/2');
        copied.classList.add('opacity-1000', 'transform-y-0');

        setTimeout(() => {
            copied.classList.remove('opacity-1000', 'transform-y-0');
            copied.classList.add('opacity-0', 'transform-y-1/2');
        }, 600);

    }

    if (cookisName !== "" && cookisEmail !== "") {
        summaryContrainer.classList.add('hidden');
        loaderContainer.classList.add('hidden');
        document.body.classList.remove('overflow-y-hidden');
        ShowUserDataInsideTheirElements(cookisName);
    } else {
        summaryContrainer.classList.remove('hidden');
        loaderContainer.classList.add('hidden');
        document.body.classList.add('overflow-y-hidden');
    }
}

function ShowUserDataInsideTheirElements(name) {
    if (name) {
        document.querySelector('.loader-container').classList.add('hidden');
        document.querySelector('.summary-container').classList.add('hidden');
        document.querySelector('.username').innerHTML = name;
        const interval = setInterval(setTime, 1000);
    } else {
        checkCookie();
    }
}

// submit auth form

const currentForm = document.querySelector('.summary-container form');

currentForm.onsubmit = e => {
    e.preventDefault();
    checkUserFields(e.target['user'].value, e.target['email'].value);
    return false;
}

function checkUserFields(name, email) {
    if (name, email) {
        setCookie('name', name, 30);
        setCookie('email', email, 30);
        document.querySelector('.loader-container').classList.remove('hidden');
        ShowUserDataInsideTheirElements(name);
    }
}