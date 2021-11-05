import { useStore } from "vuex";
const wsUrl = process.env.NODE_ENV === 'development' ? "ws://127.0.0.1:8002/ws" : "wss://deploy.guangdianyun.tv/ws"
let socket = null;

export const connectSocket = () => {
    socket = new WebSocket(wsUrl);
    const store = useStore();
    socket.onopen = function() {
        console.log("websocket connected!!");
    };
    socket.onmessage = function(msg) {
        let result = JSON.parse(msg.data ?? {})
        if(result.cmd == "finished") {
            store.commit("ws/updateRecord", result)
        }
        
        store.commit("ws/setWsRes", JSON.parse(msg.data ?? {}));
    };
    socket.onerror = function(err) {
        console.log("error", err);
    };
};

export const sendSocketMessage = msg => {
    if (1 === socket.readyState) socket.send(JSON.stringify(msg));
};
