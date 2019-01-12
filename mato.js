// Hブリッジモータードライバの二本の制御端子にそれぞれPCA9685のPWM信号を入力し正逆転と速度コントロールをします。
var pca9685pwmPromise;

const ws = new WebSocket("wss://4191333.xyz:3052/?room=po_mato");
var times = 0;

onload = async function () { // ポートを初期化するための非同期関数
    try {
        console.log("onload");
        var i2cAccess = await navigator.requestI2CAccess();
        var i2cPort = i2cAccess.ports.get(1);
        var pca9685pwm = new PCA9685_PWM(i2cPort, 0x40);
        await pca9685pwm.init(100);
        pca9685pwmPromise = pca9685pwm;
    } catch (error) {
        console.error("error", error);
    }
}

var direction = 1;
var ratio = 0;

async function speed(speedVal) {
    ratio = speedVal;
    await setMotor();
}


async function setMotor() { //値は0.0~1.0
    var pca9685pwm = await pca9685pwmPromise;
    
	if ( direction == 1 ){
		await pca9685pwm.setPWM(0,0);
        await pca9685pwm.setPWM(1,ratio);
        await pca9685pwm.setPWM(2,0);
        await pca9685pwm.setPWM(3,ratio);
	} else if ( direction == -1 ){
        await pca9685pwm.setPWM(0,ratio);
        await pca9685pwm.setPWM(1,0);
        await pca9685pwm.setPWM(2,ratio);
        await pca9685pwm.setPWM(3,0);
	} else {
		await pca9685pwm.setPWM(0,0);
        await pca9685pwm.setPWM(1,0);
        await pca9685pwm.setPWM(2,0);
        await pca9685pwm.setPWM(3,0);
	}
	
}


async function stop() {
    direction = 0;
    await setMotor();
}

async function fwd() {
    direction = 1;
    await setMotor();
}

async function rev() {
    direction = -1;
    await setMotor();
}


// 単に指定したms秒スリープするだけの非同期処理関数
// この関数の定義方法はとりあえず気にしなくて良いです。コピペしてください。
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

ws.onmessage = (message) => {

    var val = message.data;

    if(val > 2.0){
        speed(0.0);
    }
    else if(val > 1.5){
        speed(0.05);
    }
    else if(val > 1.0){
        speed(0.1);
    }
    else if(val > 0.8){
        speed(0.2);
    }
    else if (val > 0.5) {
        speed(0.4);
    }
    else{
        speed(0.5);
    }

    if(val == 0){
        speed(0.0);
    }

    if(times < 3){
        fwd();
        times++;
    }
    else if(times < 6){
        rev();
        times++;
    }
    else{
        times = 0;
    }
    console.log(val);
}
