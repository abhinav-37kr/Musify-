console.log("Lets write Javascript");
let currentSong = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {

    currFolder = folder;
    let a = await fetch(`https://github.com/abhinav-37kr/Musify-/tree/main/songs/${folder}/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li>
                            <i class="fa-solid fa-music"></i>
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Abhinav K R</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <i class="fa-solid fa-circle-play"></i>
                            </div>
                        </li>`;

    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })

    })

    

}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}


const playMusic = (track, pause = false) => {
    // let audio= new Audio("/songs/" +track)

    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {

        currentSong.play()
        play.classList.remove("fa-circle-play");
        play.classList.add("fa-circle-pause");
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    let a = await fetch(`https://github.com/abhinav-37kr/Musify-/tree/main/songs`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    let array = Array.from(anchors)


    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {

            let folder = e.href.split("/").slice(-1)[0];
            //get metadata of folder
            let a = await fetch(`https://github.com/abhinav-37kr/Musify-/tree/main/songs/${folder}/info.json`);
            let response = await a.json();

            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                        <i class="fa-solid fa-circle-play"></i>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }

    }

    //load the playlist when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);

        })
    })
}

async function main() {



    await getSongs("songs/chill");
    playMusic(songs[0], true);


    //display the albums  on the page
    displayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.classList.remove("fa-circle-play");
            play.classList.add("fa-circle-pause");
        }
        else {
            currentSong.pause();
            play.classList.remove("fa-circle-pause");
            play.classList.add("fa-circle-play");
        }

    })

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currentSong.currentTime = (e.offsetX / e.target.getBoundingClientRect().width) * currentSong.duration;
    })

    //add event listener to the hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //add event listener to prev and next
    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {

            playMusic(songs[index - 1]);
        }
    })

    next.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        playMusic(songs[(index + 1) % songs.length]);
    })

}

main() 