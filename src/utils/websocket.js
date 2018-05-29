import config from '../config';
var websocket = null;
var listeners = []


function wsConnect(firstMsg,onMsg){
    if(websocket==null||websocket.readyState!=0){
        if('WebSocket' in window){
            websocket = new WebSocket(config.socketServer);
      
            clearListener()
            listeners.push(onMsg)
            websocket.onerror = function(){
                console.log("链接错误")
            };
            
            //连接成功建立的回调方法
            websocket.onopen = function(event){
                wsSend(firstMsg)
                console.log("链接建立")
               
            }
            
            //接收到消息的回调方法
            websocket.onmessage = function(event){
            for (var i=0;i<listeners.length;i++) {
                    listeners[i](JSON.parse(event.data))
                }
            
            }
            
            //连接关闭的回调方法
            websocket.onclose = function(){
                console.log("链接关闭")
            }
            
        }else{
            console.log('Not support websocket')
        }
       
    }else{
        wsSend(firstMsg)
    }
}


function  wsSend(message){
    //message.token=user.token
    websocket.send(JSON.stringify(message));
}
function wsClose(){
    websocket.close();
}
function clearListener(){
    listeners=[]
}
function addListener(func){
    listeners.push(func)
}

export {
    wsSend,addListener,clearListener,wsConnect,wsClose
  }
  