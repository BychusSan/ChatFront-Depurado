// sidebar.component.ts

import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { StorageHelper } from 'src/app/services/localstorage.service';
import { LoginService } from 'src/app/services/login.service';
import { ChatComponent } from '../PruebaChat/chat.component';
import { LectorService } from 'src/app/services/lector.service';
import { MessageService } from 'src/app/services/message.service';
import { IMessage, Mensaje } from 'src/app/interfaces/message.interface';
import { SignalRService } from 'src/app/services/signalr.service';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Output() toggle: EventEmitter<void> = new EventEmitter<void>();

  

  sidebarWidth: string = '200px';
  connectedUsers: IUser[] = [];
  connectedUsers2: IUser[] = [];

  private subscription: Subscription = new Subscription();
  private privateMessageSubscription : Subscription = new Subscription();

  userData: IUser;
  salaSeleccionada: string = '';
  salaSeleccionada2: string = '';
  label: string = '';
  currentUser2: IUser;
  speechEnabled: boolean = true;

  showModal: boolean[] = [];

  avatarUrlInput: string = ''; 
  roomType: string = ''; // Valor inicial

  // emisor: string = 'Usuario1'; 
  // receptor: string = ''; 
  // mensaje: string = '';
  // usuarioActual: string = 'Usuario2'; 
  // mensajes: Mensaje[] = [];
  // currentUser: string = ''; 
  usuarioActual: any | IUser[] = [];

  currentUser: IUser;
  mensajes: { usuario: string; mensaje: string }[] = [];

  selectedUser: string = ''; 
  messageText: string = ''; 
  messages: IMessage[] = []; 
  privateMessages: IMessage[]=[];
  private messageSubscription: Subscription | undefined;
  get connected() {
    return this.signalRService.connected;
  }
  constructor(
    private router: Router,
    private loginService: LoginService,
    public lectorService: LectorService,
    private signalRService: SignalRService,
    private messageService: MessageService
  ) {

    this.messageSubscription = this.signalRService.messageSubscription.subscribe((message: IMessage) => {
      this.messages.push(message); // Agregar el nuevo mensaje a la lista
    });
    this.privateMessageSubscription = this.signalRService.privateMessageSubscription.subscribe((message: IMessage) => {
      this.privateMessages.push(message); // Agregar el nuevo mensaje a la lista
    });
    // this.messageService.messageLog$.subscribe((mensajes: Mensaje[]) => {
    //   console.log('Mensajes recibidos:', mensajes);
    //   this.mensajes = mensajes;
    // });

    this.currentUser = this.loginService.getUserLogged()!;

    this.userData = {
      ...StorageHelper.getItem<IUser>('usuario')!,
      avatar: StorageHelper.getAvatar()!,
    };

    this.salaSeleccionada = this.userData.rol!;

    this.currentUser2 = this.loginService.currentUser2!;
  }

  ngOnInit(): void {

 

        // Suscribirse a los mensajes entrantes
        this.signalRService.messageSubscription.subscribe((message: IMessage) => {
          // this.messages.push(message); // Agregar el nuevo mensaje a la lista
        });


        this.getPrivateMessages();
        console.log(this.privateMessages)

        this.signalRService.connectUser();

    // const usuarioActual = this.loginService.getUserName(); // Obtener nombre de usuario actual
    // this.mensajes = this.messageService.obtenerMensajesUsuario(usuarioActual!);
    // this.mostrarUsuariosDeListaCreada();

    this.loginService.onLoginSuccess.subscribe(() => {
      this.mostrarUsuariosDeListaCreada();
    });

    this.connectedUsers.forEach(() => this.showModal.push(false));

    //  Intervalo para actualizar la lista cada X segundos
    const intervalTime = 5000; // 5000 milisegundos = 5 segundos
    this.subscription = interval(intervalTime).subscribe(() => {
      this.mostrarUsuariosDeListaCreada();
    });
  }


  ngAfterContentInit(): void {


    // this.getPrivateMessages();
    // this.getMessages();
  }
  ngOnDestroy(): void {
    // Limpia la suscripción
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
     // Asegúrate de desuscribirte para evitar fugas de memoria
     if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
  

  private mostrarUsuariosDeListaCreada() {
    this.loginService.getConnectedUsers().subscribe(
      (users) => {
        // this.connectedUsers = users;
             // Ordenar usuarios alfabéticamente por nombre
             this.connectedUsers = users.sort((a, b) => a.nombre!.localeCompare(b.nombre!));
      
      },
      (error) => {
        console.error('Error obteniendo usuarios conectados', error);
      }
    );
  }

  toggleSidebar() {
    this.sidebarWidth = this.sidebarWidth === '200px' ? '0' : '200px';
    this.toggle.emit();
  }

  inicio(): void {
    this.router.navigate(['/inicio']);
  }

  // chat(): void {
  //   this.router.navigate(['/chat']);
  // }

  navigateToRoom(): void {
    const roomType = this.userData.room;
    let destinationComponent: string;

    switch(roomType) {
      case 'Conjunta':
        destinationComponent = '/chat';
        break;
      case 'Sala 1':
        destinationComponent = '/sala1';
        break;
      case 'Sala 2':
        destinationComponent = '/sala2';
        break;
      case 'Sala 3':
        destinationComponent = '/sala3';
        break;
      case 'Sala 4':
        destinationComponent = '/sala4';
        break;
      case 'Sala 5':
        destinationComponent = '/sala5';
        break;
      case 'Sala 6':
        destinationComponent = '/sala6';
        break;
      default:
        destinationComponent = '/chat'; 
    }

    this.router.navigate([destinationComponent]);
  }




  registrar2(): void {
    this.router.navigate(['/registro']);
  }

  historial(): void {
    this.router.navigate(['/historial']);
  }

  sala1(): void {
    this.router.navigate(['/sala1']);
  }
  // getLabelForSala(sala: string): string {
  //   switch (sala) {
  //     case 'admin':
  //       return 'Sala conjunta';
  //     case 'Grupo 1':
  //       return 'Sala 1';
  //     case 'Grupo 2':
  //       return 'Sala 2';
  //     case 'Grupo 3':
  //       return 'Sala 3';
  //     case 'Grupo 4':
  //       return 'Sala 4';
  //     case 'Grupo 5':
  //       return 'Sala 5';
  //     case 'Grupo 6':
  //       return 'Sala 6';
  //     default:
  //       return sala;
  //   }
  // }
  getLabelForSala(sala: string): string {
    switch (sala) {
      case 'Conjunta':
        return 'Sala Conjunta';
      default:
        return sala;
    }
  }

  archivos(): void {
    this.router.navigate(['/archivos']);
  }

  botonesSala(buttonText: string) {
    if (this.speechEnabled) {
      this.lectorService.speakBotones(buttonText);
    }
  }

  readUserData(userName: string, roomText: string) {
    if (this.speechEnabled) {
      this.lectorService.speakBotones(userName);
      this.lectorService.speakBotones(roomText);
    }
  }

  sortByName(users: IUser[]): IUser[] {
    return users.sort((a, b) => a.nombre!.localeCompare(b.nombre!));
  }




  // openAvatarUrlDialog(): void {
  //   this.showModal = true;
  // }

  // closeAvatarUrlDialog(): void {
  //   this.showModal = false;
  // }
  openAvatarUrlDialog(index: number) {
    this.showModal[index] = true;
  }
  
  closeAvatarUrlDialog(index: number) {
    this.showModal[index] = false;
  }
  
  // enviarMensaje(receptor: string): void {
  //   const emisor = this.loginService.getUserName(); // Obtener nombre de usuario actual
  //   this.messageService.enviarMensaje(emisor!, receptor, this.mensaje);
  //   this.mensaje = ''; // Limpiar el textarea después de enviar el mensaje
  // }
  

  // Método para enviar un mensaje privado al usuario seleccionado
  // sendPrivateMessage() {
  //   const message: IMessage = {
  //     user: this.selectedUser,
  //     text: this.messageText,
  //     avatar: '', // Puedes asignar el avatar del remitente si es necesario
  //     room: '', // Asigna la sala correspondiente si es necesario
  //     file: '' // Puedes asignar el archivo adjunto si es necesario
  //   };
  //   this.signalRService.sendMessage(message); // Llama al método sendMessage del servicio
  //   this.messages.push(message); // Agrega el mensaje enviado a la lista de mensajes para mostrarlo
  //   this.messageText = ''; // Limpia el input después de enviar el mensaje
  // }



    // Método para enviar un mensaje privado

    sendPrivateMessage() {
      const currentUser = this.loginService.getUserLogged();
      if (!currentUser) {
        return; 
      }
      console.log(currentUser)
      const message: IMessage = {
        // user: this.selectedUser,
        user: `${currentUser.nombre}`,
        // user: this.userData.nombre!,
        text: this.messageText,
        avatar: '',
        room: '',
        file: ''
      };
      this.signalRService.sendMessage(message);
      this.messages.push(message); 
      this.messageText = ''; 
      
    }
    
    sendPrivateMessage2(receiverId: string) {
      const currentUser = this.loginService.getUserLogged();
      if (!currentUser) {
          return; 
      }
  
      const privateMessages: IMessage = {
        user: `${currentUser.nombre}`,
          text: this.messageText,
          avatar: currentUser.avatar!,
          room: '',    
          file: '',
          receptor: receiverId, // intentar establecer el ID del receptor como el room del mensaje
          
      };
  
      this.signalRService.sendPrivateMessage(privateMessages); 
      this.privateMessages.push(privateMessages); 
      this.messageText = ''; 
  }

 
  


    getMessages() {
      if (!this.messageSubscription) {
        this.messageSubscription =
          this.signalRService.messageSubscription.subscribe({
            next: (message: IMessage) => {
              const usuario = message.user.trim();
              let mensaje = message.text;
              const file = message.file;
              console.log('Mensaje recibido en sidebar.component.ts:', message);

                this.mensajes.push({ usuario, mensaje });
            },
            error: (err: any) => {
              console.error('Error en sidebar.component.ts:', err);
            },
            complete: () => {
              console.log('Conexión cerrada en sidebar.component.ts');
            },
          });
      }
    }
    // isCurrentUserMessage(mensajeUsuario: string): boolean {
    //   return mensajeUsuario === this.currentUser.nombre;
    // }


    getPrivateMessages() {
      if (!this.privateMessageSubscription) {
        this.privateMessageSubscription = 
        this.signalRService.privateMessageSubscription.subscribe({
          next: (message: IMessage) => {
            const usuario = message.user.trim();
            let mensaje = message.text;
            console.log('Mensaje privado recibido en sidebar.component.ts:', message);
    
            // Verificar si el mensaje fue enviado desde este componente
            if (this.isCurrentUserMessage(usuario)) {
              this.privateMessages.push({ user: usuario, text: mensaje, avatar: '', room: '', file: '' });
            }
          },
          error: (err: any) => {
            console.error('Error en sidebar.component.ts:', err);
          },
          complete: () => {
            console.log('Conexión cerrada en sidebar.component.ts');
          },
        });
      }
    }
    
    isCurrentUserMessage(mensajeUsuario: string): boolean {
      // Comparar el nombre del usuario emisor con el nombre del usuario actual
      return mensajeUsuario === this.currentUser.nombre;
    }
    

}
