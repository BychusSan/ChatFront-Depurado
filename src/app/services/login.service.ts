import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs'; // Importa Subject de RxJS
import { environment } from 'src/environments/environment';
import { ITokenInfo, IUser } from '../interfaces/user.interface';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  urlAPI = environment.urlAPI;

  private loginSuccessSubject = new Subject<void>();
  public onLoginSuccess = this.loginSuccessSubject.asObservable();
  private currentUser: IUser | null = null;
  currentUser2: IUser | null = null;

  private connectedUsers: IUser[] = [];
  // private currentRoom: string = '';
  // private isPageReloading = false;
  // private broadcastChannel = new BroadcastChannel('sessionChannel');

  public isLoggedIn: boolean = false; // Propiedad para verificar si el usuario está conectado

  constructor(private http: HttpClient, private router: Router) {

    // PARA QUE CIERRE SESION AL CERRAR VENTANA                    OJOOOOO VENTANAAAAA
    window.addEventListener('beforeunload', () => this.beforeunloadHandler());
  }

  login(usuario: IUser): Observable<ITokenInfo> {
    return this.http
      .post<ITokenInfo>(this.urlAPI + '/Usuario/login', usuario)
      .pipe(
    
        tap((tokenInfo: ITokenInfo) => {      

          this.currentUser = {
            nombre: tokenInfo.nombre,
            email: usuario.email,
            token: tokenInfo.token,
            rol: tokenInfo.rol,
            room: tokenInfo.room,
            avatar: tokenInfo.avatar,
            lastConnection: tokenInfo.lastConnection,
          };
          this.loginSuccessSubject.next();

               // Actualizar el estado de conexión del usuario
        this.updateLoggedInStatus(true);
        })
      );
  }

  logout(): void {
    this.disconnectUserByEmail().subscribe(
      (response) => {
        console.log(`Usuario desconectado correctamente.`);
        this.currentUser = null;
        localStorage.removeItem('usuario');

        this.getConnectedUsers().subscribe((currentUsers: IUser[]) => {
          const updatedUsers = currentUsers.filter(
            (user) => user.email !== this.getUserEmail()
          );

          this.updateConnectedUsers(updatedUsers);
        });
              // Actualizar el estado de conexión del usuario
      this.updateLoggedInStatus(false);
      },
      (error) => {
        console.error(`Error al desconectar al usuario.`, error);

        this.currentUser = null;
        localStorage.removeItem('usuario');
              // Actualizar el estado de conexión del usuario
      this.updateLoggedInStatus(false);
      }
    );
  }

  updateConnectedUsers(users: IUser[]): void {
    this.connectedUsers = users;
  }

  getUserLogged(): IUser | null {
    console.log('Usuario actualmente logeado:', this.currentUser);
    return this.currentUser;
  }

  //MOSTRAR USUARIOS CONECTADOS QUE CONECTA AL USUARIOS CONTROLLER DEL BACK Y AL CHAT.COMPONENT.TS
  getConnectedUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.urlAPI + '/Usuario/connectedUsers');
  }


  disconnectUserByEmail(): Observable<any> {
    const userEmail = this.getUserEmail();
    if (userEmail) {
      const url = `${this.urlAPI}/usuario/disconnectUser?userEmail=${userEmail}`;
      return this.http.delete(url, { responseType: 'text' });
    } else {
      console.error('No se pudo obtener el correo electrónico del usuario.');
      return new Observable();
    }
  }
  disconnectAllUsers(): Observable<any> {
    const url = `${this.urlAPI}/usuario/disconnectAllUsers`;
    return this.http.delete(url, { responseType: 'text' });
  }


  updateUserRoomByEmail(newRoom: string): Observable<any> {
    const userEmail = this.getUserEmail();
    if (userEmail) {
      const url = `${this.urlAPI}/usuario/updateUserRoom?userEmail=${userEmail}&newRoom=${newRoom}`;
      return this.http.put(url, null, { responseType: 'text' });
    } else {
      console.error('No se pudo obtener el correo electrónico del usuario.');
      return new Observable();
    }
  }

  private beforeunloadHandler(): void {
    this.logout();
  }

  getUserEmail(): string | null {
    return this.currentUser ? this.currentUser.email! : null;
  }

  getUserRole(): string | null {
    return this.currentUser && this.currentUser.rol
      ? this.currentUser.rol
      : null;
  }
  getUserName(): string | null {
    return this.currentUser ? this.currentUser.nombre! : null;
  }
  getUserAvatar(): string | null {
    console.log(this.currentUser);
    return this.currentUser ? this.currentUser.avatar! : null;
  }
    // Método para actualizar el estado de conexión del usuario
    updateLoggedInStatus(status: boolean): void {
      this.isLoggedIn = status;
    }
     // Método para obtener el estado de conexión del usuario
  getLoggedInStatus(): boolean {
    return this.isLoggedIn;
  }
}
