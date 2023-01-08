const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
//프론트에서 소켓을 받기 위해 backend로 연결할때 필요한 코드
//${window.location.host} = 어디에 인터넷 주소가 위치해 있는지 알려주는 코드
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);
}

//socket이 connection을 open했을때 발생
socket.addEventListener("open", ()=>{
    console.log("connected to Server 😗")
})

//메세지를 받을 때마다 내용을 출력하는 message
socket.addEventListener("message",(message)=>{
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
})

//서버가 오프라인 될때 발생하는 코드
socket.addEventListener("close",()=>{
    console.log("Disconnected from Server 😴")
})

function handleSubmit(events){
    events.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(input.value);
    input.value = "";
}

function handleNickSubmit(events){
    events.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send({
        type:"nickname",
        payload:input.value,
    });
}

messageForm.addEventListener("submit",handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);