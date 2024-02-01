import express from 'express';
import expressWs from 'express-ws';
import WebSocket from 'ws';

interface WebSocketClient {
  ws: any; 
  userId: string;
}

export class WebSocketServer {
  private static instance: WebSocketServer;
  private  clients:WebSocket[] = [];
  private constructor(app:express.Express) {

    const { app: wsApp } = expressWs(app);
    wsApp.ws('/ws', (ws, req) => {
        this.clients.push(ws);
        ws.on('message', (message) => this.handleMessage(ws,message.toString()));
        ws.on('close', () => {
          const index = this.clients.indexOf(ws);
          if (index !== -1) {
            this.clients.splice(index, 1);
          }
        });
    });


  }

  /**
   * 消息分发管理
   * @param client 
   * @param rawMessage 
   */
  private handleMessage(client: WebSocket, rawMessage: string): void {
    try {
      const {type,message} = JSON.parse(rawMessage);
      switch (type) {
        case 'Ping':
          client.send('Pong');
          break;
        case 'chat':
          client.send("登陆接口");
          break;
        default:
          client.send("无效消息");
      }
    } catch (error) {
      console.error(`WebSocketServer Error message from ${rawMessage}`);
    }
  }
  public static getInstance(server: express.Express|null): WebSocketServer {
    if (!WebSocketServer.instance) {
      WebSocketServer.instance = new WebSocketServer(server!);
    }
    return WebSocketServer.instance;
  }
}