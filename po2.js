document.onkeydown = keydown;

const ws = new WebSocket("wss://4191333.xyz:3052/?room=po");

function keydown(event) {
  // target = document.getElementById("message");
  // target.innerHTML = "キーが押されました KeyCode :" + event.keyCode;
  //
  // target = document.getElementById("messageShift");
  if (event.which == 87) {
    ws.send(1); //上
  }
  if (event.which == 83) {
    ws.send(2);　//下
  }
  if (event.which == 68) {
    ws.send(3); //右
  }
  if (event.which == 65) {
    ws.send(4); //左
  }
}

ws.onmessage = (message)=>{
  mes.innerHTML += message.data+"<br>";
}
