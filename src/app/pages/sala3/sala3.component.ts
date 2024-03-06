import {
    Component,
    OnInit,
    AfterContentInit,
    NgModule,
    ChangeDetectorRef,
    ElementRef,
    ViewChild,
    OnDestroy,
  } from '@angular/core';
  import { Router } from '@angular/router';
  import { IMessage } from 'src/app/interfaces/message.interface';
  import { IUser } from 'src/app/interfaces/user.interface';
  import { UserChatService } from 'src/app/services/UserChat.service';
  import { LoginService } from 'src/app/services/login.service';
  import { UsuariosService } from 'src/app/services/usuarios.service';
  import { MessageService } from 'primeng/api';
  import { Subscription, interval } from 'rxjs';
  import { FileDataService } from 'src/app/services/fileData.Service';
  import { LectorService } from 'src/app/services/lector.service';
import { StorageHelper } from 'src/app/services/localstorage.service';
import { SignalRService } from 'src/app/services/signalr.service';
  
  @Component({
    selector: 'app-sala3',
    templateUrl: './sala3.component.html',
    styleUrls: ['./sala3.component.css'],
    providers: [MessageService],
  })
  export class Sala3Component implements OnInit, AfterContentInit, OnDestroy {
    @ViewChild('chatList') chatList: ElementRef;
    lastSentMessage: string = '';
    private messageSubscription: Subscription | undefined;
  
    lastReceivedMessage: string = '';
    isSpeechEnabled: boolean = false;
    speechEnabled: boolean = true;
    speechUtterance: SpeechSynthesisUtterance | null = null;
  
    lastImageName: string | undefined;
    lastImageUrl: string | undefined;
    currentUser: IUser;
    connectedUsers: IUser[] = [];
    messages: any[] = [];
    usuariosConectados: any[] = [];
    private subscription: Subscription = new Subscription();
    usuarios: IUser[] = [];
    userData: IUser;
    mensajes: { usuario: string; mensaje: string; fecha?: Date }[] = [];
    // mensajes: IMessage[] = [];
    mensajes2: { usuario: string; mensaje: string }[] = [];
    allMessages: { usuario: string; mensaje: string }[] = [];
    mensajeNuevo: string = '';
    mensajeNuevo2: string = '';
    usuarioNuevo: string = '';
    salaSeleccionada: string = '';
    salaSeleccionada2: string = '';
    avatarUrl: string = '';
  
    // usuarioActual: any;
    usuarioActual: any | IUser[] = [];
  
    textToRead: string = '';
  
    get connected() {
      return this.signalrService.connected;
    }
  
    isVisible: boolean = true;
    botonCambio: string = 'Ocultar Salas';
  
    constructor(
      private signalrService: SignalRService,
      private loginService: LoginService,
      private usuariosService: UsuariosService,
      private userChatService: UserChatService,
      private messageService: MessageService,
      private cdr: ChangeDetectorRef,
      private fileDataService: FileDataService,
      public lectorService: LectorService,
      private router: Router,
    ) {
      this.chatList = new ElementRef(null); // Inicialización de chatList
  
      this.userData = {
        ...StorageHelper.getItem<IUser>('usuario')!,
        avatar: StorageHelper.getAvatar()!,
      };
  
      this.salaSeleccionada = this.userData.room!;
  
      if (this.connectedUsers.length > 0) {
        this.salaSeleccionada2 = this.connectedUsers[0].room!;
        console.log(`SALASELECCIONADA2:`, this.salaSeleccionada2);
      }
  
      this.currentUser = this.loginService.getUserLogged()!;
      
    }
  
    ngOnInit(): void {
      
      // this.speak();
      this.mensajes = StorageHelper.obtenerMensajes3() || [];  // TODO: HACER UNA FUNCION PARA GUARDAR LOS MENSAJES EN EL LOCAL STORAGE
      this.lectorService.speakChatText();
      this.getUsuarios();
      this.editarUsuario(this.usuarioActual);
      this.signalrService.connectUser();
      this.fetchConnectedUsers();
  
  
      // Configura un intervalo para actualizar la lista cada X segundos
      const intervalTime = 5000; // 5000 milisegundos = 5 segundos
      this.subscription = interval(intervalTime).subscribe(() => {
        this.fetchConnectedUsers();
      });
  
      this.userChatService.usuariosConectados$.subscribe((usuarios) => {
        this.usuarios = usuarios;
        console.log('Usuarios conectados a la SALA 1:', usuarios);
      });
  
      this.usuariosService.getUsuarios().subscribe({
        next: (data) => {
          this.usuarios = data;
  
        },
        error: (err) => {
          alert('Error en el acceso a datos');
        },
      });
      console.log('Datos del usuario:', this.userData);
      
    }
  
    ngAfterContentInit(): void {
      this.signalrService.connect();
  
      //para los sonidos
      // this.sonidoAleatorioConectar();
  
      this.getMessages();
    }
  
    ngOnDestroy(): void {  
      if (this.messageSubscription) {
        this.messageSubscription.unsubscribe();
      }
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  
  
    
  
  
  //+ ......................................................MANEJO DE MENSAJES..........................................................
  
sendMessage({ text, file }: Omit<IMessage, 'user' | 'avatar' | 'room'>) {
  if (
    (text.trim() !== '' || file) &&
    this.currentUser &&
    this.currentUser.nombre
  ) {
    const texto = `${this.currentUser.nombre}: ${text}`;
    const message: IMessage = {
      user: `${this.currentUser.nombre}`,
      text: text,
      avatar: '',      
      rol: this.currentUser.rol!,
      room: this.currentUser.room!,
      fecha: new Date(),
      file: file,
      id: this.currentUser.id,
    };
    
    // StorageHelper.guardarMensaje([{ usuario: this.currentUser.nombre, mensaje: text }]);
    this.signalrService.sendMessage(message);   
    console.log(message);
    this.mensajeNuevo = '';
  }
}

  getMessages() {
    if (!this.messageSubscription) {
      this.messageSubscription =
        this.signalrService.messageSubscription.subscribe({
          next: (message: IMessage) => {
            const usuario = message.user.trim();
            let mensaje = message.text;
            const file = message.file;
            const fecha = message.fecha;
            console.log('Mensaje recibido en chat.component.ts:', message);
            if (usuario === 'Sistema') {
              this.messageService.add({
             
                severity: 'warn',             
                summary: 'Advertencia',
                detail: message.text,
                life: 3000,

              });
            }
            if (usuario === 'Host') {
              this.messageService.add({
                severity: 'success',
                summary: 'Sistema',
                detail: message.text,
                life: 3000,

              });
            }
          
            if (message.room === this.currentUser.room) {
              this.mensajes.push({ usuario, mensaje, fecha });

              if (file) {                
                const downloadLink = `<a href="${file}" download="archivo_descargado">Descargar archivo</a>`;
                this.messageService.add({
                  severity: 'info', 
                  summary: 'Imagen adjunta',
                  detail: downloadLink,
                  life: 3000,

                });
              }

              // !!Detección de cambios en tiempo real
              this.cdr.detectChanges();

              StorageHelper.guardarMensaje3([{ usuario: usuario, mensaje: mensaje }]);

              this.lectorService.lastReceivedMessage =
                message.user.trim() + ': ' + message.text;
              if (this.lectorService.isSpeechEnabled) {
                this.lectorService.speakChat();
              }

              this.cdr.markForCheck();
            }
            if (document.visibilityState === 'hidden') {
              const sound = new Audio('assets/Sonidos/notification-sound-7062.mp3');
              sound.play();
            }
          },
          error: (err: any) => {
            console.error('Error en chat.component.ts:', err);
          },
          complete: () => {
            console.log('Conexión cerrada en chat.component.ts');
          },
        });
    }
  }
  
    isCurrentUserMessage(mensajeUsuario: string): boolean {
      return mensajeUsuario === this.currentUser.nombre;
    }
  
    //+ ____________________________________________________________________________________________________________________________________
    chat(): void {
      this.router.navigate(['/chat']);
    }
    sala1(): void {
  
      this.router.navigate(['/sala1']);
    }
    sala2(): void {
  
      this.router.navigate(['/sala2']);
    }
    sala3(): void {
  
      this.router.navigate(['/sala3']);
    }
    sala4(): void {
  
      this.router.navigate(['/sala4']);
    }
    sala5(): void {
  
      this.router.navigate(['/sala5']);
    }
    sala6(): void {
      this.router.navigate(['/sala6']);
    }
    //+ ...............................................MANEJO DE ARCHIVOS........................................................
  
    onFileSelected(event: any): void {
      const file: File = event.target.files[0];
      if (file) {
        this.fileDataService.uploadFile(file).subscribe(
          (response) => {
            console.log('Archivo enviado correctamente:', response);
            const fileUrl = response.fileUrl;
            const fileName = file.name;
  
            const message: IMessage = {
              user: `${this.currentUser.nombre}`,
              text: `<a href="${fileUrl}" download="${fileName}" target="_blank">${fileName}</a>`,
              avatar: '',
              rol: this.currentUser.rol!,
              room: this.currentUser.room!,
              file: fileUrl,
              id: this.currentUser.id,
            };
  
            StorageHelper.guardarMensaje3([{ usuario: `${this.currentUser.nombre}`, mensaje: `<a href="${fileUrl}" download="${fileName}" target="_blank">${fileName}</a>` }]);
            this.signalrService.sendMessage(message);
          },
          (error) => {
            console.error('Error enviando archivo:', error);
          }
        );
      }
    }
  
   
  
    isImageFile(fileType: string): boolean {
      return fileType.startsWith('image/');
    }
  //+ .....................................................................................................................
  
  
  
  
  //+...............................................................GESTIÓN DE SALAS....................................................
  
    moverSala(sala: string, button: HTMLButtonElement) {
      this.alternarSalas(button);
      this.currentUser.room = sala;
    }
  
  
    alternarSalas(button: HTMLButtonElement) {
      document.querySelectorAll('.custom-button').forEach(function (btn) {
        btn.classList.remove('active');
      });
  
      button.classList.add('active');
    }
  
  
    getRoomName(): string {
      switch (this.currentUser.room) {
        case 'Conjunta':
          return 'SALA CONJUNTA';
        default:
          return this.currentUser.room!;
      }
    }

    //+................................................................MANEJO USUARIOS.......................................................
  
    private fetchConnectedUsers() {
      this.loginService.getConnectedUsers().subscribe(
        (users) => {
          this.connectedUsers = users;
        },
        (error) => {
          console.error('Error obteniendo usuarios conectados', error);
        }
      );
    }
  
    updateRoom(newRoom: string): void {
      this.loginService.updateUserRoomByEmail(newRoom).subscribe(
        (response) => {
          console.log('Sala actualizado correctamente:', response);
        },
        (error) => {
          console.error('Error al actualizar el rol:', error);
        }
      );
    }
  
    getUsuarios() {
      this.usuariosService.getUsuarios().subscribe({
        next: (data) => {
          // OJO: con essto filtramos la lista de usuarios para encontrar el que coincide con userData.nombre
          const usuarioActual = data.find(
            (usuario) => usuario.nombre === this.userData.nombre
          );
  
          if (usuarioActual) {
            this.usuarioActual = usuarioActual;
          } else {
            console.error(
              'No se encontró el usuario actual en la lista de usuarios.'
            );
          }
  
          console.log(
            'Usuario actual obtenido en UsuariosComponent:',
            this.usuarioActual
          );
        },
        error: (err) => {
          alert('Error en el acceso a datos');
        },
      });
    }
    editarUsuario(usuario: any) {
      this.usuarioActual = usuario;
    }
  
    guardarAvatar(): void {
      if (
        this.avatarUrl.trim() !== 'https://sstc.ac.in/img2/faculty/faculty.jpg'
      ) {
        StorageHelper.setAvatar(this.avatarUrl);
        this.userData.avatar = this.avatarUrl;
      }
    }
  
  
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    }
  
    toggleButtonText() {
      this.botonCambio = this.botonCambio === 'Mostrar Salas' ? 'Ocultar Salas' : 'Mostrar Salas';
    }
  
    //+............. Métodos traídos del sidebar para el botón de archivos........................
    archivos(): void {
      this.router.navigate(['/archivos']);
    }
  
    botonesSala(buttonText: string) {
      if (this.speechEnabled) {
        this.lectorService.speakBotones(buttonText);
      }
    }
  
    //+ ____________________________________________________________________________________________________________________________________
  
  
    getAvatarUrl(usuario: string): string {
      if (this.isCurrentUserMessage(usuario)) {
        // Si el mensaje fue enviado por el usuario actual, devuelve su avatar
        return this.usuarioActual?.avatar || '';
      } else {
        // Busca el usuario en la lista de usuarios conectados
        const usuarioEncontrado = this.connectedUsers.find(user => user.nombre === usuario);
        // Si se encuentra el usuario, devuelve la URL de su avatar, de lo contrario, devuelve una cadena vacía
        return usuarioEncontrado ? usuarioEncontrado.avatar! : '';
      }
    }

  }
  