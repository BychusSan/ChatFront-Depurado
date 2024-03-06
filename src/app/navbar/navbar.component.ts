import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnInit,
  signal,
} from '@angular/core';
import { LoginService } from '../services/login.service';
import { MessageService } from 'primeng/api';
import { LectorService } from '../services/lector.service';
import { IUser } from '../interfaces/user.interface';
import { perfilComponent } from '../pages/perfil/perfil.component';
import { UsuariosService } from '../services/usuarios.service';
import { UserChatService } from '../services/UserChat.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [MessageService],
})
export class NavbarComponent implements OnInit {
  messages: any[] = [];
  userEmail: string | null = null;
  userRol: string | null = null;
  userNombre: string | null = null;
  // userAvatar: string | null = null;
  userAvatar  =  signal<string|null>(null);
  
  usuarios: IUser[] = [];
  userData: IUser[] = []; // Inicializamos la propiedad userData como un array vacío de IUser
  avatarUrl: string = ''; // Propiedad para almacenar la URL del avatar
  
  
  usuarioActual: any | IUser[] = [];
  
  isUserConnected: boolean = false;
  // ___________ prueba para el modo oscuro _____________
  darkMode = false;
  @HostBinding('class')
  get themeMode() {
    return this.darkMode ? 'dark-theme' : 'light-theme';
  }

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    public lectorService: LectorService,
    public perfilComponent: perfilComponent,
    private cdr: ChangeDetectorRef,
    private usuariosService: UsuariosService,
    private userChatService: UserChatService,
  ) {

  }


    // ___________ prueba para el modo oscuro _____________
  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
  }


  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadUserData();
    });
   setInterval(() => {
    this.loadUserData();
  }, 5000);

    const storedUser = JSON.parse(localStorage.getItem('usuario') || 'null');
    if (storedUser) {
      this.userEmail = storedUser.email;
      this.userRol = storedUser.rol;
      this.userNombre = storedUser.userNombre;
      // this.userAvatar = storedUser.userAvatar;
      this.userAvatar.update(()=>storedUser.userAvatar);
    }

    this.loginService.onLoginSuccess.subscribe(() => {
      this.userEmail = this.loginService.getUserEmail();
      this.userRol = this.loginService.getUserRole();
      this.userNombre = this.loginService.getUserName();
      // this.userAvatar = this.loginService.getUserAvatar();
      this.userAvatar.update(()=>this.loginService.getUserAvatar());
    });
  }
  // ngAfterContentInit(): void {
  // }


  startUserDataCheck(): void {
    this.loadUserData();

    setInterval(() => {
      if (this.loginService.getLoggedInStatus()) {
        this.loadUserData();
      }
    }, 5000);
  }

  
  loadUserData() {
    // this.loginService.getLoggedInStatus();
    this.usuariosService.getUsuarios().subscribe(
      (data: IUser[]) => {
        this.userData = data;
        // Buscar el usuario actual dentro de data (por ejemplo, usando el userEmail)
        const usuarioActual = data.find(user => user.email === this.userEmail);
        if (usuarioActual) {
          // Asignar los datos del usuario actual
          this.userEmail = usuarioActual.email !== undefined ? usuarioActual.email : null;
          this.userRol = usuarioActual.rol !== undefined ? usuarioActual.rol : null;
          this.userNombre = usuarioActual.nombre !== undefined ? usuarioActual.nombre : null;
          // this.userAvatar = usuarioActual.avatar !== undefined ? usuarioActual.avatar : null;
          this.userAvatar.update(()=>usuarioActual.avatar !== undefined ? usuarioActual.avatar : null);
        }
      },
      error => {
        console.error('Error al cargar datos de usuario:', error);
      }
    );
  }
  

  getUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        
      console.log('Usuarios obtenidos en UsuariosComponent:', data);
      this.userChatService.actualizarUsuariosConectados(data);
      
      },
      error: (err) => {
        alert('Error en el acceso a datos');
      }
    });
  }
  

  logout(): void {
    this.loginService.logout();
    this.userEmail = null;
    this.userRol = null;
    localStorage.removeItem('usuario');
    this.messageService.add({
      severity: 'success',
      summary: 'Cerrar Sesión',
      detail: 'Se cerró la sesión exitosamente.',
      life: 3000,
    });

    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 2000);
  }

  // OJO SE ESTA SUANDO EN EL LOGIN SERVICE para desconectar usuario de la lista del backend, metodo que se ejecuta cuando deseas desconectar al usuario
  disconnectUser(): void {
    this.loginService.disconnectUserByEmail().subscribe(
      (response) => {
        console.log(`Usuario desconectado correctamente.`);
       
      },
      (error) => {
        console.error(`Error al desconectar al usuario.`, error);
       
      }
    );
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  chat(): void {
    this.router.navigate(['/chat']);
  }

  registrar2(): void {
    this.router.navigate(['/registro']);
  }

  historial(): void {
    this.router.navigate(['/historial']);
  }

  perfil(): void {
    this.router.navigate(['/perfil']);
  }

  toggleSidebar() {
    const contenedorBotones = document.getElementById('contenedor-botones')!;
    const contenedorContenido = document.getElementById(
      'contenedor-contenido'
    )!;

    if (contenedorBotones.style.width === '200px') {
      contenedorBotones.style.width = '0';
      contenedorContenido.style.marginLeft = '0px';
    } else {
      contenedorBotones.style.width = '200px';
    
    }
  }


}
