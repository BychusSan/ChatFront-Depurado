import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMessage, Mensaje } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageLog: Mensaje[] = [];
  private messageLogSubject = new BehaviorSubject<Mensaje[]>([]);
  // public messageLog$ = this.messageLogSubject.asObservable();
  public messageLog$: Observable<Mensaje[]> = this.messageLogSubject.asObservable();

  constructor() {}

  enviarMensaje(emisor: string, receptor: string, contenido: string): void {
    const mensaje: Mensaje = { emisor, receptor, contenido };
    this.messageLog.push(mensaje);
    this.messageLogSubject.next([...this.messageLog]);
    console.log('Mensaje enviado:', mensaje);
  }

  obtenerMensajesUsuario(usuario: string): Mensaje[] {
    return this.messageLog.filter(mensaje => mensaje.receptor === usuario || mensaje.emisor === usuario);
  }
}
