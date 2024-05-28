console.log('lets start js project');  
let currentsong=new Audio;
let songs;
let curFolder;

function secondsToMinutesSeconds(seconds) {
    if(isNaN(seconds)|| seconds<0){
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder){

    let a= await fetch(`http://127.0.0.1:5500/${folder}/`)
    curFolder=folder;
    let response= await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        } 
    }

    // show all the songs in the playlist
    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=" "
    for (const song of songs) {
        songul.innerHTML=songul.innerHTML+`<li><img class="invert" src="svgs/music.svg" alt="">
        <div class="info">
            <div> ${song.replaceAll("%20"," ")} </div>
            <div>dhrupal</div>
        </div>
        <div class="playnow">
              <span>playnow</span>
              <img class="invert" src="svgs/playbar.svg" alt="">
        </div></li>`;
    }


    // attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

}
const playmusic=(track,pause=false)=>{
    currentsong.src=`/${curFolder}/`+track
    if(!pause){
        currentsong.play()
        play.src="svgs/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"

    
}

async function displayAlbums(){
    let a= await fetch(`http://127.0.0.1:5500/songs/`)
    let response= await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a")
    let cardcontainer=document.querySelector(".cardcontainer")
    let array= Array.from(anchors)
      for(let index=0;index<array.length;index++){
        const e=array[index];

        if(e.href.includes("/songs")){
            let folder=e.href.split("/").slice(-2)[0]
            console.log(folder)
            //get the metadata of folder
            let a= await fetch(`http://127.0.0.1:5500/songs/ncs/info.json`)
            let response= await a.json();
            console.log(response)
            cardcontainer.innerHTML=cardcontainer.innerHTML+` <div data-folder="ncs"  class="card ">
            <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 20V4L19 12L5 20Z" fill="#000" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
            </div>
            <img src="/songs/ncs/cover.jpeg" alt="image">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`  
        }    
    }

        //load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e=>{
            e.addEventListener("click",async item=>{
                songs= await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            })
        })
}

async function main(){
    // get the list of songs
    await getsongs("songs/ncs")
    playmusic(songs[0],true)

    //display all the albums on the page
    displayAlbums()

    // attach an event listener to paly ,next and previous
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="svgs/pause.svg"
        }
        else{
            currentsong.pause()
            play.src="svgs/playbar.svg"
        }
    })

    //listen for time update event

    currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${
            secondsToMinutesSeconds(currentsong.currentTime)} / ${
                secondsToMinutesSeconds(currentsong.duration)}`
                document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
    })

    //add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = (currentsong.duration)* percent/100

    })

    //add eventlistener to hamburgericon

    document.querySelector(".hamburger").addEventListener("click",()=>{
         document.querySelector(".left").style.left = "0"
    })

    // add eventlistener to closeicon
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%"
    })

    // add eventlistener to priveous
    previous.addEventListener("click",()=>{

        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playmusic(songs[index-1])
        }
    })
  
    // add eventlistener to next
    next.addEventListener("click",()=>{

        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
            playmusic(songs[index+1])
        }
    })

    // add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentsong.volume=parseInt(e.target.value)/100
        console.log(currentsong.volume)
    })

    //add event listner to mute volume
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("svgs/volume.svg")){
            e.target.src=e.target.src.replace("svgs/volume.svg","svgs/mute.svg")
            currentsong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src=e.target.src.replace("svgs/mute.svg","svgs/volume.svg")
            currentsong.volume=0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
    })
}
main()