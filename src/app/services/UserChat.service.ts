// user-chat.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserChatService {
  private usuariosConectadosSubject = new BehaviorSubject<IUser[]>([]);
  usuariosConectados$ = this.usuariosConectadosSubject.asObservable();

  constructor() {}

  actualizarUsuariosConectados(usuarios: IUser[]) {
    this.usuariosConectadosSubject.next(usuarios);
    console.log('Usuarios actualizados en el servicio:', usuarios);
  }


}
