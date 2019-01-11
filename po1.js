document.onkeydown = typeGame;

var moji = new Array("Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","Ｇ","Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ","Ｎ","Ｏ","Ｐ","Ｑ","Ｒ","Ｓ","Ｔ","Ｕ","Ｖ","Ｗ","Ｘ","Ｙ","Ｚ");
var kcode = new Array(65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90);
var rnd = new Array();

var mondai = "";       //問題の文字列を格納
var cnt=0;             //何問目か格納
var passSec = 0;
var score = 0;
var typStart,typEnd;

const ws = new WebSocket("wss://4191333.xyz:3052/?room=po_mato");

function ransu(){
  for ( var i = 0 ; i < 1000 ; i++ )
  {
    rnd[i] = Math.floor( Math.random() * 26 );
  }
}

function gameSet(){
  mondai="";
  cnt=0;
  passSec = 0;
  document.getElementById('sec').innerHTML = "一文字目を押すと開始されます"

  ransu();

  for ( var i = 0 ; i < 1000 ; i++){
    mondai =  mondai + moji[ rnd[i] ];
  }

  document.getElementById("waku").innerHTML = mondai;
}

function typeGame(evt){
  var kc;  //入力されたキーコードを格納する変数
  //入力されたキーのキーコードを取得
  if (document.all){
    kc = event.keyCode;
  }else{
    kc = evt.which;
  }
  //入力されたキーコードと、問題文のキーコードを比較
  if (kc == kcode[ rnd[cnt] ]){
    if (cnt==0){
      typStart = new Date();
      timer1 = setInterval(timeout_callback1, 1000);
    }

    cnt++; //カウント数を＋１にする

    //全文字入力したか確認
    if ( cnt < 1000){
      //問題文の頭の一文字を切り取る
      mondai = mondai.substring(1,mondai.Length);

      //問題枠に表示する
      document.getElementById("waku").innerHTML = mondai;
    }
    else{
      //全文字入力していたら、終了時間を記録する
      typEnd = new Date();

      //終了時間－開始時間で掛かったミリ秒を取得する
      var keika = typEnd - typStart;

      //1000で割って「切捨て」、秒数を取得
      var sec = Math.floor( keika/1000 );

      //1000で割った「余り(%で取得できる）」でミリ秒を取得
      var msec = keika % 1000;

      //問題終了を告げる文字列を作成
      var fin="GAME終了　時間："+sec+"秒"+msec;

      //問題枠にゲーム終了を表示
      document.getElementById("waku").innerHTML = fin;

      stopTimer();
    }
  }
}

function timeout_callback1(score){
  passSec+=1;
  score = cnt/passSec;
  document.getElementById('sec').innerHTML = score + "字/秒"
  ws.send(score);
}

function stopTimer(){
    if (timer1 != null)
        clearInterval(timer1);
    timer1 = null;
}

ws.onmessage = (message)=>{
  mes.innerHTML += message.data+"<br>";
}
