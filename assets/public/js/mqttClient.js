var connected_flag=0	
var mqtt;
var reconnectTimeout = 2000;
var host="io.adafruit.com/kimhungtdblla24";
var port=1883;
var row=0;
var out_msg="";
var mcount=0;
var user_name="kimhungtdblla24";
var password="aio_UDSA14XHRvdTduRIlQnWGDlGVVah";
var server = "io.adafruit.com/kimhungtdblla24";
var stopic= "kimhungtdblla24/feeds/da-tkll-rq";
var ptopic = "kimhungtdblla24/feeds/da-tkll-rp";

var flagWaitReponse = false;
var cmdWaitCheck = "";
var SCH_mode = "";
const indexSCH_Delete = [];

var cmdJSON = "";
var cmdFormat;

var NORMAL_MODE = "Normal";
var SLOW_MODE = "Slow mode";
var MANUAL_MODE = "Manual Control";
var SCHEDULE_MODE = "Schedule is running";

function onConnectionLost(){
	console.log("connection lost");
	document.getElementById("status").innerHTML = "Connection Lost";
	document.getElementById("status_messages").innerHTML ="Connection Lost";
    document.forms["connform"]["conn"].style= "display:inline";
    document.forms["connform"]["discon"].style= "display:none";
	connected_flag=0;

}
function onFailure(message) {
    console.log("Failed");
    document.getElementById("status_messages").innerHTML = "Connection Failed- Retrying";
    setTimeout(MQTTconnect, reconnectTimeout);
    // MQTTconnect();
    }
function onMessageArrived(r_message){

    var cmdText = "";

    cmdText = r_message.payloadString;
    out_msg="Message received:  "+cmdText + "<br/>";

    console.log(out_msg+row);
    try{
        document.getElementById("out_messages").innerHTML+=out_msg;
    }
    catch(err){
    document.getElementById("out_messages").innerHTML=err.message;
    }

    if (row==10){
        row=1;
        document.getElementById("out_messages").innerHTML=out_msg;
        }
    else
        row+=1;
        
    mcount+=1;
    console.log(mcount+"  "+row);
    
    cmdJSON = JSON.parse(cmdText);
    var cmd = cmdJSON.cmd;
    var check = cmdJSON.check;

    if(flagWaitReponse == true)
    {
        var cmdStatus = cmdJSON.status ;
        var cmdCheck = cmdJSON.cmdCheck +"-" + cmdStatus ;
        if(cmd == "check" && check == 1 && cmdCheck == cmdWaitCheck || (cmdStatus == "sch" && check >= 1)) 
        {
            flagWaitReponse = false;
            responseProcess(cmdJSON.cmdCheck,cmdStatus);
        }
    }
    if(cmd == "update" && check == 0)
    {
        requestUpdate();
    }
}
    
function onConnected(recon,url){
console.log(" in onConnected " +reconn);
}
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
document.getElementById("status_messages").innerHTML ="Connected to "+host +"on port "+port;
connected_flag=1;
document.getElementById("status").innerHTML = "Connection successful !";
console.log("on Connect "+connected_flag);
document.forms["connform"]["conn"].style= "display:none";
document.forms["connform"]["discon"].style= "display:inline";
sub_topics();
}
function disconnect()
{
if (connected_flag==1)
{
    document.forms["connform"]["conn"].style= "display:inline";
    document.forms["connform"]["discon"].style= "display:none";

    mqtt.disconnect();
    window.location="./setting.html";
}
}

function MQTTconnect() {

clean_sessions=true;

document.getElementById("status_messages").innerHTML ="";

console.log("connecting to "+ host +" "+ port +"clean session="+clean_sessions);
console.log("user "+user_name);
document.getElementById("status_messages").innerHTML='connecting';
var x=Math.floor(Math.random() * 10000); 
var cname="orderform-"+x;
mqtt = new Paho.MQTT.Client(host,port,cname);
var options = {
    timeout: 3,
    cleanSession: clean_sessions,
    onSuccess: onConnect,
    onFailure: onFailure,
    
    };
    if (user_name !="")
    options.userName = user_name;
if (password !="")
    options.password = password ;

    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.onConnected = onConnected;

mqtt.connect(options);
return false;
}

function sub_topics(){
mqtt.subscribe(stopic,1);
return false;
}

function send_message(){
    // document.getElementById("status_messages").innerHTML ="";
    if (connected_flag==0){
    out_msg="<b>Not Connected so can't send</b>";
    // document.getElementById("status_messages").innerHTML = out_msg;
    alert("Chưa kết nối Server! Vui lòng kết nối lại!");
    return false;
    }
    var msg = document.forms["smessage"]["message"].value;
    // document.getElementById("status_messages").innerHTML="Sending message  "+msg;

    message = new Paho.MQTT.Message(msg);
    message.destinationName = ptopic;
    message.qos=1;
    message.retained=true;
    mqtt.send(message);
    return false;
}

function send_cmd( cmd){
    
    if (connected_flag==0){
    out_msg="<b>Not Connected so can't send</b>"
    // console.log(out_msg);
    // document.getElementById("status_messages").innerHTML = out_msg;
    alert("Not connected to the server yet! Please reconnect!");
    return false;
    }
    var msg = cmd;
    // document.getElementById("status_messages").innerHTML="Sending message  "+msg;

    message = new Paho.MQTT.Message(msg);
    message.destinationName = ptopic;
    message.qos=1;
    message.retained=true;
    mqtt.send(message);
    return false;
}

function sendAndWaitRes()
{
    var cmdJson = JSON.stringify(cmdFormat);

    // Khởi tạo chờ Response
    cmdWaitCheck= cmdFormat.cmd + "-" + cmdFormat.status;
    flagWaitReponse = true ;

    return send_cmd(cmdJson);
}
///////// Control //////////////////////////////////
function turnOnControl(){
    // Định dạng câu lệnh sẽ gửi
    cmdFormat = {cmd:"on", check:0 , status:"control", paras:0 };
    sendAndWaitRes();
}
function turnOffControl(){
    // Định dạng câu lệnh sẽ gửi
    cmdFormat = {cmd:"off", check:0 , status:"control", paras:0 };
    sendAndWaitRes();
}
///////// Set Normal /////////////
function setTimeLight()
{
    var valueG1 = document.getElementById("textG1").textContent;
    var valueY1 = document.getElementById("textY1").textContent;
    var valueG2 = document.getElementById("textG2").textContent;
    var valueY2 = document.getElementById("textY2").textContent;

    document.getElementById("textG1").style = "display:none";
    document.getElementById("textY1").style = "display:none";
    document.getElementById("textG2").style = "display:none";
    document.getElementById("textY2").style = "display:none";

    document.getElementsByClassName("inputTimeTrafic")[0].style = "display:inline";    
    document.getElementsByClassName("inputTimeTrafic")[1].style = "display:inline";    
    document.getElementsByClassName("inputTimeTrafic")[2].style = "display:inline";    
    document.getElementsByClassName("inputTimeTrafic")[3].style = "display:inline";

    document.getElementById("inputTimeG1").value = valueG1;
    document.getElementById("inputTimeY1").value = valueY1;
    document.getElementById("inputTimeG2").value = valueG2;
    document.getElementById("inputTimeY2").value = valueY2;

    document.getElementById("btnSaveTime").style = "display:inline;";
    document.forms["disTime"]["btnCancel"].style = "display:inline;";
    document.forms["disTime"]["btnEdit"].style = "display:none;";
}
function saveTimeLight()
{
    var valG1 = parseInt(document.getElementById("inputTimeG1").value); 
    var valY1 = parseInt(document.getElementById("inputTimeY1").value); 
    var valG2 = parseInt(document.getElementById("inputTimeG2").value); 
    var valY2 = parseInt(document.getElementById("inputTimeY2").value); 

    // Định dạng câu lệnh sẽ gửi
    cmdFormat = {cmd:"set", check:0 , status:"normal", paras:1, valueTime: [valG1, valY1, valG2, valY2] };
    sendAndWaitRes();
}
function btn_Normal_Cancel()
{
    document.getElementsByClassName("inputTimeTrafic")[0].style = "display:none";    
    document.getElementsByClassName("inputTimeTrafic")[1].style = "display:none";    
    document.getElementsByClassName("inputTimeTrafic")[2].style = "display:none";    
    document.getElementsByClassName("inputTimeTrafic")[3].style = "display:none";

    document.getElementById("textG1").style = "display:inline";
    document.getElementById("textY1").style = "display:inline";
    document.getElementById("textG2").style = "display:inline";
    document.getElementById("textY2").style = "display:inline";

    document.getElementById("btnSaveTime").style = "display:none;";
    document.forms["disTime"]["btnEdit"].style = "display:inline;";
    document.forms["disTime"]["btnCancel"].style = "display:none;";
}
//////// Manual Control///////////////////////
function turnOnManualMode()
{
    var color = document.querySelector("#manualLightColor").textContent;

    cmdFormat = {cmd:"start", check:0 , status:"manual", paras:1, valueColor:"red" };
    
    if(color.toString() == "Red")
    {
        cmdFormat["valueColor"] = "red";
    }
    else if(color.toString() == "Green")
    {
        cmdFormat["valueColor"] = "green";
    }
    // Gửi lệnh và chờ response
    sendAndWaitRes();
}
function turnOffManualMode()
{
    // Định dạng câu lệnh sẽ gửi
    cmdFormat = {cmd:"stop", check:0 , status:"manual", paras:0 };
    // Gửi lệnh và chờ response
    sendAndWaitRes();
}
function turnSwitchManualMode()
{
    var color = document.querySelector("#manualLightColor");
    var value = color.textContent;
    // Định dạng câu lệnh sẽ gửi
    cmdFormat = {cmd:"set", check:0 , status:"manual", paras:1, valueColor:"red" };
    if(value.toString() == "Red")
    {
        cmdFormat["valueColor"] = "green";
    }
    else if(value.toString() == "Green")
    {
        cmdFormat["valueColor"] = "red";
    }
    // Kiểm tra xem đã bắt đầu chế độ chưa ?
    // Nếu có, gửi cmd chuyển màu xuống gateway
    if(document.querySelector("#statusLightTraffic").textContent.toString() == MANUAL_MODE)
    {
        // Gửi lệnh và chờ response
        sendAndWaitRes();
    }
    else{
        if(value.toString() == "Red")
        {
            color.textContent = "Green";
        }
        else if(value.toString() == "Green")
        {
            color.textContent = "Red";
        }
    }
}

// 
//////////// Slow Mode //////////////
function turnOnSlowMode(){    

    if(document.querySelector("#statusLightTraffic").textContent.toString() == NORMAL_MODE)
    {
        // Định dạng câu lệnh sẽ gửi
        cmdFormat = {cmd:"start", check:0 , status:"slow", paras:0 };
        // Gửi lệnh và chờ response
        sendAndWaitRes();
    }
        
    
}
function turnOffSlowMode(){    
     // Định dạng câu lệnh sẽ gửi
    cmdFormat = {cmd:"stop", check:0 , status:"slow", paras:0 };
    // Gửi lệnh và chờ response
    sendAndWaitRes();
}

////////// Schedule /////////////////////////////////
function btn_SCH_AddTime()
{
    document.querySelector("#inputSCH").style = "display: table-row;";
    document.querySelector("#btnSCH_Save").style = "display: inline;";
    document.querySelector("#btnSCH_Cancel").style = "display: inline;";    
    document.querySelector("#btnSCH_Edit").style = "display: none;";
    document.querySelector("#btnSCH_Add").style = "display: none;";
    document.querySelector("#btnSCH_Delete").style = "display: none;";

    SCH_mode = "add";
    var checkbox = document.getElementsByName('SCH_Select');

    document.querySelector("#SCH_stt").textContent = checkbox.length + 1;
    document.forms["SCH"]["SCH_inputStartTime"].value = "00:00";
    document.forms["SCH"]["SCH_inputStopTime"].value = "00:00";
    document.forms["SCH"]["SCH_inputTimeG1"].value = "00";
    document.forms["SCH"]["SCH_inputTimeY1"].value = "00";
    document.forms["SCH"]["SCH_inputTimeG2"].value = "00";
    document.forms["SCH"]["SCH_inputTimeY2"].value = "00";
    document.forms["SCH"]["SCH_inputNote"].value = "";

}
function btn_SCH_Edit()
{
    // Khai báo tham số
    var checkbox = document.getElementsByName('SCH_Select');
    var result = -1 ;
    for (var i = 0; i < checkbox.length; i++){
        if (checkbox[i].checked === true){
            if(result == -1)
            {
                result = i;
            }   
            else
                checkbox[i].checked = false;
        }
    }
    if(result < 0){return};    
    SCH_mode = "edit";
    document.querySelector("#inputSCH").style = "display: table-row;";
    document.querySelector("#btnSCH_Save").style = "display: inline;";
    document.querySelector("#btnSCH_Cancel").style = "display: inline;";    
    document.querySelector("#btnSCH_Edit").style = "display: none;";
    document.querySelector("#btnSCH_Add").style = "display: none;";
    document.querySelector("#btnSCH_Delete").style = "display: none;";

    var startTime = document.getElementsByName("SCH_startTime")[result].textContent;
    var stopTime = document.getElementsByName("SCH_stopTime")[result].textContent;
    var timeG1 = document.getElementsByName("SCH_timeG1")[result].textContent;
    var timeY1 = document.getElementsByName("SCH_timeY1")[result].textContent;
    var timeG2 = document.getElementsByName("SCH_timeG2")[result].textContent;
    var timeY2 = document.getElementsByName("SCH_timeY2")[result].textContent;
    var note = document.getElementsByName("SCH_note")[result].textContent;

    document.querySelector("#SCH_stt").textContent = result + 1;
    document.forms["SCH"]["SCH_inputStartTime"].value = startTime;
    document.forms["SCH"]["SCH_inputStopTime"].value = stopTime;
    document.forms["SCH"]["SCH_inputTimeG1"].value = timeG1;
    document.forms["SCH"]["SCH_inputTimeY1"].value = timeY1;
    document.forms["SCH"]["SCH_inputTimeG2"].value = timeG2;
    document.forms["SCH"]["SCH_inputTimeY2"].value = timeY2;
    document.forms["SCH"]["SCH_inputNote"].value = note;

}
function btn_SCH_Delete()
{
    // Khai báo tham số
    var checkbox = document.getElementsByName('SCH_Select');
    var num = 0 ;
    for (var i = 0; i < checkbox.length; i++){
        if (checkbox[i].checked === true){
            indexSCH_Delete[num] = i ;
            num +=1;
        }
    }
    
    if(num == 0) return ;
    // Định dạng câu lệnh sẽ gửi
    cmdFormat = {cmd:"delete", check:0 , status:"sch", paras:num, index:indexSCH_Delete };
    // Gửi lệnh và chờ response
    sendAndWaitRes();
    
}
function btn_SCH_Save()
{
    document.querySelector("#btnSCH_Save").style = "display: none;";
    document.querySelector("#btnSCH_Cancel").style = "display: none;";    
    document.querySelector("#btnSCH_Edit").style = "display: inline;";
    document.querySelector("#btnSCH_Add").style = "display: inline;";
    document.querySelector("#btnSCH_Delete").style = "display: inline;";    
    document.querySelector("#inputSCH").style = "display: none;";
    

    var startTime = document.forms["SCH"]["SCH_inputStartTime"].value;
    var stopTime = document.forms["SCH"]["SCH_inputStopTime"].value;
    var timeG1 = parseInt(document.forms["SCH"]["SCH_inputTimeG1"].value);
    var timeY1 = parseInt(document.forms["SCH"]["SCH_inputTimeY1"].value);
    var timeG2 = parseInt(document.forms["SCH"]["SCH_inputTimeG2"].value);
    var timeY2 = parseInt(document.forms["SCH"]["SCH_inputTimeY2"].value);
    var note = document.forms["SCH"]["SCH_inputNote"].value;

    var valueAdd = [-1,startTime,stopTime,timeG1,timeY1,timeG2,timeY2];

    switch (SCH_mode ) {
        case "add":
            var checkbox = document.getElementsByName('SCH_Select');
            var idx = parseInt(checkbox.length);
            valueAdd[0] = idx;
            cmdFormat = {cmd:"add", check:0 , status:"sch", paras:1, valueSCH:valueAdd };
            SCH_mode = "none";  
            break;
        case "edit":
            var idx = parseInt(document.querySelector("#SCH_stt").textContent) - 1  ;
            valueAdd[0] = idx;
            cmdFormat = {cmd:"edit", check:0 , status:"sch", paras:1, valueSCH:valueAdd };
                SCH_mode = "none";
            break;
        default:
            SCH_mode = "none";
            break;

        
    }
    // Gửi lệnh và chờ response
    sendAndWaitRes();
    
    document.querySelectorAll(".SCH_Select").checked = false;

    var checkbox = document.getElementsByName('SCH_Select');
    for (var i = 0; i < checkbox.length; i++){
        if (checkbox[i].checked === true){
            checkbox[i].checked = false;
        }
    }
}
function btn_SCH_Cancel()
{
    document.querySelector("#btnSCH_Save").style = "display: none;";
    document.querySelector("#btnSCH_Cancel").style = "display: none;";    
    document.querySelector("#btnSCH_Edit").style = "display: inline;";
    document.querySelector("#btnSCH_Add").style = "display: inline;";
    document.querySelector("#btnSCH_Delete").style = "display: inline;";
    
    document.querySelector("#inputSCH").style = "display: none;";

    SCH_mode = "Normal";

    var checkbox = document.getElementsByName('SCH_Select');
    for (var i = 0; i < checkbox.length; i++){
        if (checkbox[i].checked === true){
            checkbox[i].checked = false;
        }
    }
}
// Xử lí câu lệnh Request (từ board)

function RQ_Update_All(){
    cmdFormat = {cmd:"update", check:0 , status:"all", paras:0 };
    sendAndWaitRes();
}
function requestUpdate()
{
    switch(cmdJSON.status)
    {
        case "status":
            switch(cmdJSON.valueStatus)
            {
                case "normal":
                    document.querySelector("#statusLightTraffic").textContent = NORMAL_MODE;
                    break;
                case "sch":
                    document.querySelector("#statusLightTraffic").textContent = SCHEDULE_MODE;
                    break;
            }
            break;
        case "normal":
            // Cập nhật giá trị thời gian
            var valueTime = cmdJSON.valueTime;
            document.getElementById("textG1").textContent = valueTime[0];
            document.getElementById("textY1").textContent = valueTime[1];
            document.getElementById("textG2").textContent = valueTime[2];
            document.getElementById("textY2").textContent = valueTime[3];
            break;
        case "manual":
            var valueStatus = cmdJSON.valueStatus;
            var valueColor =  cmdJSON.valueColor;
            switch (valueStatus) {
                case "start":
                    document.querySelector("#statusLightTraffic").textContent = MANUAL_MODE;
                    document.querySelector("#btnManualStop").style = "display: inline";
                    document.querySelector("#btnManualStart").style = "display: none";
                case "set":
                    var color = document.querySelector("#manualLightColor");
                    if(valueColor.toString() == "red")
                    {
                        color.textContent = "Red";
                    }
                    else if(valueColor.toString() == "green")
                    {
                        color.textContent = "Green";
                    }
                    break;
                case "stop":
                    document.querySelector("#btnManualStop").style = "display: none";
                    document.querySelector("#btnManualStart").style = "display: inline";           
                    document.querySelector("#statusLightTraffic").textContent = NORMAL_MODE
                    ;
                    break;
            }
            break;
        case "slow":
            var valueStatus = cmdJSON.valueStatus;
            switch(valueStatus)
            {
                case "start":
                    document.querySelector("#btnSlowModeStop").style = "display: inline";
                    document.querySelector("#btnSlowModeStart").style = "display: none";
                    document.querySelector("#statusLightTraffic").textContent = SLOW_MODE;
                    break;
                case "stop":
                    document.querySelector("#btnSlowModeStop").style = "display: none";    
                    document.querySelector("#btnSlowModeStart").style = "display: inline";
                    document.querySelector("#statusLightTraffic").textContent = NORMAL_MODE
                    ;
                    break;
            }
            break;
        case "sch":
            var valueMode = cmdJSON.valueMode;
            var valueSch = cmdJSON.valueSch;
            switch(valueMode)
            {
                case "add":
                case "edit":
                    var schCount = parseInt( document.getElementsByName('SCH_Select').length);
                    var index = valueSch[0];

                    if(index == schCount) // Thêm sch mới
                    {
                        var parent = document.querySelector("#SCH_table").getElementsByTagName("tbody")[0];
                        var node = document.createElement("tr");
                    
                        parent.appendChild(node);
                        parent.getElementsByTagName("tr")[index+2].innerHTML = 
                        "<td><input type=\"checkbox\" name=\"SCH_Select\" class=\"SCH_Select\"></td><td name=\"SCH_idx\"></td><td><span name=\"SCH_startTime\"></span></td><td><span name=\"SCH_stopTime\"></span></td><td><span name=\"SCH_timeG1\"></span></td><td><span name=\"SCH_timeY1\"></span></td><td><span name =\"SCH_timeG2\"></span></td><td><span name=\"SCH_timeY2\"></span></td><td><span name=\"SCH_note\"></span></td>";
                        
                    }

                    document.getElementsByName("SCH_idx")[index].textContent = index;
                    document.getElementsByName("SCH_startTime")[index].textContent = valueSch[1];
                    document.getElementsByName("SCH_stopTime")[index].textContent = valueSch[2];
                    document.getElementsByName("SCH_timeG1")[index].textContent = valueSch[3];
                    document.getElementsByName("SCH_timeY1")[index].textContent = valueSch[4];
                    document.getElementsByName("SCH_timeG2")[index].textContent = valueSch[5];
                    document.getElementsByName("SCH_timeY2")[index].textContent = valueSch[6];
                    document.getElementsByName("SCH_note")[index].textContent = "";
                    break;
                case "delete":
                    var parent = document.querySelector("#SCH_table");
                    var index = valueSch[0];
                    var child ;
                    child = parent.getElementsByTagName("tr")[index + 2];
                    child.remove();                    
                    var checkBoxNum = document.getElementsByName("SCH_Select").length;
                    for(var i=0; i< checkBoxNum; i++)
                    {
                        document.getElementsByName("SCH_idx")[i].textContent = i  ;
                    }
                    break;
            }
            break;
    }
}
// Xử lí câu lệnh Response (đến server)
function responseProcess( cmd , status )
{
    if(cmd != "update")
        alert("Update successfully! !");
    switch (cmd) {
        case "set":            
            switch(status)
            {
                case "normal":
                    
                    document.getElementsByClassName("inputTimeTrafic")[0].style = "display:none";    
                    document.getElementsByClassName("inputTimeTrafic")[1].style = "display:none";    
                    document.getElementsByClassName("inputTimeTrafic")[2].style = "display:none";    
                    document.getElementsByClassName("inputTimeTrafic")[3].style = "display:none";
                
                    var valG1 = document.getElementById("inputTimeG1").value; 
                    document.getElementById("textG1").textContent = valG1;
                    document.getElementById("textG1").style = "display:inline";
                    var valY1 = document.getElementById("inputTimeY1").value; 
                    document.getElementById("textY1").textContent = valY1;
                    document.getElementById("textY1").style = "display:inline";
                    var valG2 = document.getElementById("inputTimeG2").value; 
                    document.getElementById("textG2").textContent = valG2;
                    document.getElementById("textG2").style = "display:inline";
                    var valY2 = document.getElementById("inputTimeY2").value; 
                    document.getElementById("textY2").textContent = valY2;
                    document.getElementById("textY2").style = "display:inline";
                
                    document.getElementById("btnSaveTime").style = "display:none;"
                    document.forms["disTime"]["btnCancel"].style = "display:none;";
                    document.forms["disTime"]["btnEdit"].style = "display:inline;";
                    break;
                case "manual":
                    var color = document.querySelector("#manualLightColor");
                    var value = color.textContent;
                    if(value.toString() == "Red")
                    {
                        color.textContent = "Green";
                    }
                    else if(value.toString() == "Green")
                    {
                        color.textContent = "Red";
                    }

                    break;
            }

            break;
        case "start":
            switch(status)
            {
                case "manual":
                    document.querySelector("#statusLightTraffic").textContent = MANUAL_MODE;
                    document.querySelector("#btnManualStop").style = "display: inline";
                    document.querySelector("#btnManualStart").style = "display: none";
                    break;
                case "slow":
                    document.querySelector("#btnSlowModeStop").style = "display: inline";
                    document.querySelector("#btnSlowModeStart").style = "display: none";
                    document.querySelector("#statusLightTraffic").textContent = SLOW_MODE;
                    break;
            }

            break;
        case "stop":
            switch(status)
            {
                case "manual":
                    document.querySelector("#btnManualStop").style = "display: none";
                    document.querySelector("#btnManualStart").style = "display: inline";           
                    document.querySelector("#statusLightTraffic").textContent = NORMAL_MODE
                    ;
                    break;
                case "slow":
                    document.querySelector("#btnSlowModeStop").style = "display: none";    
                    document.querySelector("#btnSlowModeStart").style = "display: inline";
                    document.querySelector("#statusLightTraffic").textContent = NORMAL_MODE
                    ;
                    break;
            }
            break;
        case "delete":
            var parent = document.querySelector("#SCH_table");
            var child ;
            for(var i=0; i< indexSCH_Delete.length; i++){
                child = parent.getElementsByTagName("tr")[indexSCH_Delete[i] - i + 2];
                child.remove();
            }
            var checkBoxNum = document.getElementsByName("SCH_Select").length;
            for(var i=0; i< checkBoxNum; i++)
            {
                document.getElementsByName("SCH_idx")[i].textContent = i + 1 ;
            }
            break;
        case "add":
            var startTime = document.forms["SCH"]["SCH_inputStartTime"].value;
            var stopTime = document.forms["SCH"]["SCH_inputStopTime"].value;
            var timeG1 = document.forms["SCH"]["SCH_inputTimeG1"].value;
            var timeY1 = document.forms["SCH"]["SCH_inputTimeY1"].value;
            var timeG2 = document.forms["SCH"]["SCH_inputTimeG2"].value;
            var timeY2 = document.forms["SCH"]["SCH_inputTimeY2"].value;
            var note = document.forms["SCH"]["SCH_inputNote"].value;

            var checkbox = document.getElementsByName('SCH_Select');
            var parent = document.querySelector("#SCH_table").getElementsByTagName("tbody")[0];
            var node = document.createElement("tr");
            var idx = parseInt(checkbox.length)+2;
            parent.appendChild(node);
            parent.getElementsByTagName("tr")[idx].innerHTML = 
            "<td><input type=\"checkbox\" name=\"SCH_Select\" class=\"SCH_Select\"></td><td name=\"SCH_idx\"></td><td><span name=\"SCH_startTime\"></span></td><td><span name=\"SCH_stopTime\"></span></td><td><span name=\"SCH_timeG1\"></span></td><td><span name=\"SCH_timeY1\"></span></td><td><span name =\"SCH_timeG2\"></span></td><td><span name=\"SCH_timeY2\"></span></td><td><span name=\"SCH_note\"></span></td>";

            document.getElementsByName("SCH_idx")[idx-2].textContent = idx-1 ;
            document.getElementsByName("SCH_startTime")[idx - 2].textContent = startTime;
            document.getElementsByName("SCH_stopTime")[idx - 2].textContent = stopTime;
            document.getElementsByName("SCH_timeG1")[idx - 2].textContent = timeG1;
            document.getElementsByName("SCH_timeY1")[idx - 2].textContent = timeY1;
            document.getElementsByName("SCH_timeG2")[idx - 2].textContent = timeG2;
            document.getElementsByName("SCH_timeY2")[idx - 2].textContent = timeY2;
            document.getElementsByName("SCH_note")[idx - 2].textContent = note;
            break;
        case "edit":
            var startTime = document.forms["SCH"]["SCH_inputStartTime"].value;
            var stopTime = document.forms["SCH"]["SCH_inputStopTime"].value;
            var timeG1 = document.forms["SCH"]["SCH_inputTimeG1"].value;
            var timeY1 = document.forms["SCH"]["SCH_inputTimeY1"].value;
            var timeG2 = document.forms["SCH"]["SCH_inputTimeG2"].value;
            var timeY2 = document.forms["SCH"]["SCH_inputTimeY2"].value;
            var note = document.forms["SCH"]["SCH_inputNote"].value;
            
            var idx = parseInt(document.querySelector("#SCH_stt").textContent) - 1  ;
            document.getElementsByName("SCH_startTime")[idx].textContent = startTime;
            document.getElementsByName("SCH_stopTime")[idx].textContent = stopTime;
            document.getElementsByName("SCH_timeG1")[idx].textContent = timeG1;
            document.getElementsByName("SCH_timeY1")[idx].textContent = timeY1;
            document.getElementsByName("SCH_timeG2")[idx].textContent = timeG2;
            document.getElementsByName("SCH_timeY2")[idx].textContent = timeY2;
            document.getElementsByName("SCH_note")[idx].textContent = note;
            break;
        case "on":
            var statusCtrl = document.getElementById("statusControl");
            statusCtrl.textContent = "ON";
            document.forms["control"]["btnOff"].style = "display: inline";
            document.forms["control"]["btnOn"].style = "display: none";
            break;
        case "off":
            var statusCtrl = document.getElementById("statusControl");
            statusCtrl.textContent = "OFF";
            document.forms["control"]["btnOff"].style = "display: none";
            document.forms["control"]["btnOn"].style = "display: inline";
            break;
        case "update":
            switch (status)
            {
                case "all":
                    cmdFormat = {cmd:"update", check:0 , status:"status", paras:0};
                    sendAndWaitRes();
                    break;
                case "status":

                    // Gửi lệnh update tiếp theo
                    cmdFormat = {cmd:"update", check:0 , status:"normal", paras:0};
                    sendAndWaitRes();
                    break;
                case "normal":
                    // Cập nhật giá trị thời gian
                    var valueTime = cmdJSON.valueTime;
                    document.getElementById("textG1").textContent = valueTime[0];
                    document.getElementById("textY1").textContent = valueTime[1];
                    document.getElementById("textG2").textContent = valueTime[2];
                    document.getElementById("textY2").textContent = valueTime[3];
                    // alert(valueTime);
                    // Gửi lệnh update tiếp theo
                    cmdFormat = {cmd:"update", check:0 , status:"sch", paras:0};
                    sendAndWaitRes();
                    break;
                case "sch":
                // Cập nhật giá trị schedule
                var valueSch = cmdJSON.valueSch;
                var count = valueSch[0];
                if(count != 0)
                {
                    // Câp nhật sch đầu tiên
                    var checkbox = document.getElementsByName('SCH_Select');
                    var parent = document.querySelector("#SCH_table").getElementsByTagName("tbody")[0];
                    var node = document.createElement("tr");
                    var idx = parseInt(checkbox.length)+2;
                    if((parseInt(cmdJSON.check)) > parseInt(checkbox.length))
                    {
                    parent.appendChild(node);
                    parent.getElementsByTagName("tr")[idx].innerHTML = 
                    "<td><input type=\"checkbox\" name=\"SCH_Select\" class=\"SCH_Select\"></td><td name=\"SCH_idx\"></td><td><span name=\"SCH_startTime\"></span></td><td><span name=\"SCH_stopTime\"></span></td><td><span name=\"SCH_timeG1\"></span></td><td><span name=\"SCH_timeY1\"></span></td><td><span name =\"SCH_timeG2\"></span></td><td><span name=\"SCH_timeY2\"></span></td><td><span name=\"SCH_note\"></span></td>";
                    }
                    var indexSch = parseInt(cmdJSON.check) - 1;
                    document.getElementsByName("SCH_idx")[indexSch].textContent = indexSch ;
                    document.getElementsByName("SCH_startTime")[indexSch].textContent = valueSch[1];
                    document.getElementsByName("SCH_stopTime")[indexSch].textContent = valueSch[2];
                    document.getElementsByName("SCH_timeG1")[indexSch].textContent = valueSch[3];
                    document.getElementsByName("SCH_timeY1")[indexSch].textContent = valueSch[4];
                    document.getElementsByName("SCH_timeG2")[indexSch].textContent = valueSch[5];
                    document.getElementsByName("SCH_timeY2")[indexSch].textContent = valueSch[6];
                    document.getElementsByName("SCH_note")[indexSch].textContent = "";
                }
                if(parseInt(cmdJSON.check) < count)
                {
                    // Gửi lệnh update tiếp theo
                    cmdFormat = {cmd:"update", check:0 , status:"sch", paras:cmdJSON.check};
                    sendAndWaitRes(); 
                }
                if(parseInt(cmdJSON.check) == count)
                    alert("Update successfully!");                
                break;
            }
            break;
        default:
            break;
    }
}