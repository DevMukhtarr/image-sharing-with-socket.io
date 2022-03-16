let monitorScreen = document.querySelector("#monitorscreen");

const socket = io("http://localhost:3000/");

const API = 'http://localhost:3000/uploaded/file';
const fileExtension = 'http://localhost:3000/uploaded/file_extension/'
socket.on('connect', (message) =>{
  message =  `you connected with id: ${socket.id}`;
  console.log(message)
  socket.emit("sendMessage", message);
})

fetch(fileExtension)
.then(res => res.json())
.then(data => {
  let regex = /\.[0-9a-z]+$/i;  
  let extension = data.match(regex)[0];
  
  if(extension == ".txt"){
      let jsonFile = new XMLHttpRequest();
      jsonFile.open("GET",API,true);
      jsonFile.send();
      jsonFile.onreadystatechange = () => {
      const textBox = document.createElement('p');
      if (jsonFile.readyState == 4 && jsonFile.status == 200) {
        textBox.innerHTML = jsonFile.responseText;
        monitorScreen.appendChild(textBox);
      }
    }
  }else if(extension == ".jpg" || ".png"){
  fetch(API)
  .then( res => res.blob())
  .then((data) =>{
    let blobValue = data;
    
    const flagImage = document.createElement('img');
    const imageObjectUrl = URL.createObjectURL(blobValue)
    
    flagImage.className = "imageObj"
    flagImage.setAttribute(
      "src",
      imageObjectUrl
      )
      monitorScreen.appendChild(flagImage);

    /**testing */
      let imgChunks = [];
      socket.emit("new_message", data);
      socket.on('img-chunk', (chunk) =>{
      let img = document.querySelector(".imageObj");
      console.log(img)
      imgChunks.push(chunk);
      console.log(imgChunks)
      img.setAttribute('src', imageObjectUrl, + window.btoa(imgChunks));
    })
/**testing */
  })
  }
  else{
    console.log("extension is not supported yet");
  }
})