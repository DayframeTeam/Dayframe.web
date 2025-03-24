let socket: WebSocket;

export function connectWebSocket() {
  socket = new WebSocket(import.meta.env.VITE_WS_URL);

  socket.onopen = () => {
    console.log('WebSocket подключен');
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    // обработка
  };

  socket.onclose = () => {
    console.log('WebSocket отключён, повторное подключение...');
    setTimeout(connectWebSocket, 3000);
  };
}

export function sendMessage(data: any) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}
