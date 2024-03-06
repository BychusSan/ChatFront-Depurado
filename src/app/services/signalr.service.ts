// signalr.service.ts

import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnectionBuilder, HubConnection, HttpTransportType} from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { IMessage } from '../interfaces/message.interface';
import { ITokenInfo, IUser } from '../interfaces/user.interface';
import { StorageHelper } from './localstorage.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LoginService } from './login.service';
import { IMessage2 } from '../interfaces/message2.interface';

@Injectable(
  {
  providedIn: 'root'
}
)
export class SignalRService {
  urlAPI = environment.urlAPI;


  // userData: IUser = {
  //   email:"",
  //   password:"",
  //   nombre:"",
  //   rol:"",
  // };


  
  urlSignalR = environment.urlAPI;
  hubConnection!: signalR.HubConnection;
  messageSubscription: Subject<IMessage> = new Subject<IMessage>();
  privateMessageSubscription: Subject<IMessage> = new Subject<IMessage>();
  connected = false;

  constructor(public http: HttpClient, 
    private loginService: LoginService
    ) {
    this.connect();
  }

  connect() {
    if (!this.hubConnection) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        //  .withUrl('https://localhost:7217/ChatHub', {
         .withUrl('http://gabrielsan-001-site1.ftempurl.com/ChatHub', {
         

          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })

        .build();

      this.hubConnection
        .start()
        .then(() => {
          console.log('Conexión iniciada');
          this.connected = true;
          this.listenMessages();

        })
        .catch((err) => console.log('Error al iniciar la conexión: ' + err));
    }
  }



  connectUser() {
    const currentUser = this.loginService.getUserLogged();

    if (currentUser) {
      const message: IMessage = {
        id: currentUser.id,
        user: currentUser.nombre || '',
        text: '',
        rol: currentUser.rol || '',
        room: currentUser.room || '',
        avatar: '',
        file: '',
      };
      if(this.connected==true)
            this.hubConnection.send('ConnectUser', message);
    }
  }

  disconnect() {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => {
       
        this.connected = false;
        console.log('Conexión cerrada');
      }).catch((err) => console.error('Error al cerrar la conexión: ', err));
    }
  }


  listenConnectionClosed() {
    this.hubConnection.onclose((error) => {
      console.error('Conexión cerrada:', error);
    });
  }
  
  listenMessages() {
    this.hubConnection.on('GetMessage', (message: IMessage) => {
      this.messageSubscription.next(message);
    });
  }
  
  

  sendMessage(message: IMessage) {
    this.hubConnection.send('SendMessage', message);
    // this.messageSubscription.next(message); 
    console.log('sendMessage del signalrservice', message)
  }

  sendMessage2(message2: IMessage2) {
    this.hubConnection.send('SendMessage', message2);
    // this.messageSubscription.next(message); 
    console.log('sendMessage del signalrservice', message2)
  }


  sendPrivateMessage(privateMessages: IMessage) {
    this.hubConnection.send('SendPrivateMessage', privateMessages); // Nuevo método para enviar mensajes privados
    console.log('sendPrivateMessage del signalrservice', privateMessages)
}
// public sendPrivateMessage(message: IMessage) {
//   if (this.hubConnection) {
//     this.hubConnection.invoke('SendPrivateMessage', message)
//       .catch(err => console.error('Error while sending private message: ' + err));
//   }
// }


}
