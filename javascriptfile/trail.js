console.log("lets write a javascript");
let songs ;
let currFolder ;

async function circle(e) {
  e.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
}

async function move(z, y) {
  let p = (z.offsetx / z.getBoundingClientRect()) * 100
    z.addEventListener("click",()=>{

      y.style.left = p + "%"

      currentSong.currentTime = ((currentSong.duration) * p) / 100;

    })


}
function convertSecondsToMinuteFormat(seconds) {
  // Calculate the whole minutes
  var minutes = Math.floor(seconds / 60);

  // Calculate the remaining seconds
  var remainingSeconds = Math.floor(seconds % 60);

  // Format the result as "minutes:seconds"
  var formattedTime = minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;

  return formattedTime;
}

// Example usage:
var totalSeconds = 125;
var formattedTime = convertSecondsToMinuteFormat(totalSeconds);
console.log(formattedTime);


let currentSong = new Audio();

async function getsongs(folder) {
  currFolder = folder
  let a = await fetch(http://127.0.0.1:5500/${currFolder}/)
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div")
  div.innerHTML = response
  let as = div.getElementsByTagName("a")
  //  console.log(as);  
  let songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(/${currFolder}/)[1])
    }
  }
    
  let songurl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songurl.innerHTML = ""
  for (const song of songs) {
    songurl.innerHTML = songurl.innerHTML + `   <li> <img src="music.svg" alt="">
     <div class="info">
       <div>${song.replaceAll("%20", " ")}</div>
       <div>PARAS</div>
     </div>
     <div class="playnow">
       <span>Play now</span>
     <img src="play.svg" alt="">
   </div>
     </li>   `

  }

  // attached event listner

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })

  })

  return songs
}

const playmusic = (track, pause = false) => {
  //  let audio = new Audio("/1_SONGS/" + track)
  currentSong.src = /${currFolder}/ + track
  if (!pause) {
    currentSong.play()
    play.src = "pause.svg"
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00/00:00"



  
}

async function main() {

   songs = await getsongs("songs/other")
  playmusic(songs[0], true)
  console.log(songs);


  // attached event listner to pre , play and next button
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "pause.svg"
    }
    else {
      currentSong.pause()
      play.src = "play.svg"
    }
  })

  // update a time when song is playing
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${convertSecondsToMinuteFormat(currentSong.currentTime)}/${convertSecondsToMinuteFormat(currentSong.duration)} `
    circle(document.querySelector(".circle"))
    // document.getElementById("#circ").style.left = ( currentSong.currentTime/currentSong.duration)*100 + "%"

  })
  // seekbar for cut the song
  // move(document.querySelector(".seekbar"), document.querySelector(".circle"))

  document.querySelector(".seekbar").addEventListener("click",e=>{
    let p = (e.offsetX/e.target.getBoundingClientRect().width) * 100 ;
    document.querySelector(".circle").style.left = p + "%"
    currentSong.currentTime = ((currentSong.duration)*p)/100 ;
  })

 // add event listner on hamburger

 document.querySelector(".hamburger").addEventListener("click",()=>{
  document.querySelector(".left").style.left = "0%"
 })


 // add event listner on close buttom
 
 document.querySelector(".cross").addEventListener("click",()=>{
  document.querySelector(".left").style.left = "-100%"
 })
//  document.querySelector(".card").addEventListener("hover",()=>{
//   document.querySelector(".playbutton").style.opacity = 1
//  })

// add event listner on previous and nexxt

document.getElementById("previous").addEventListener("click",()=>{
  console.log("pre is click ");
  console.log(currentSong);
  let index = songs.indexOf( currentSong.src.split("/").slice(-1)[0])
  console.log(songs,index);
  if(index-1 >= length){
  playmusic(songs[index-1])
  }
})

document.getElementById("next").addEventListener("click",()=>{
  console.log("next is click ");
  let index = songs.indexOf( currentSong.src.split("/").slice(-1)[0])
  console.log(songs,index);
  if(index+1 <= songs.length){
  playmusic(songs[index+1])
  }
})

// add event t0 volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
console.log(e,e.target,e.target.value)
currentSong.volume = parseInt(e.target.value)/100
})

// load the libraray whenever card is clicked
Array.from( document.getElementsByClassName("card") ).forEach(e=>{
  e.addEventListener("click", async item=>{
    console.log(item.currentTarget.dataset.folder);
    songs = await getsongs(songs/${item.currentTarget.dataset.folder})

  })
})
 

}


main()
