import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { StorageHelper } from './localstorage.service';
import { SignalRService } from './signalr.service';
import { IArchivoInfo } from '../interfaces/arhivos.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArchivosService {
  // private urlAPI = 'https://localhost:7217/api';
  urlAPI = environment.urlAPI;


  userData: IUser;
  salaSeleccionada: string | null = null;

  constructor(private http: HttpClient, public signalRService: SignalRService) {
    this.userData = {
      ...StorageHelper.getItem<IUser>('usuario')!,
      avatar: StorageHelper.getAvatar()!,
    };
  }

  obtenerArchivos(): Observable<IArchivoInfo[]> {
    const url = `${this.urlAPI}/Archivos/todosLosArchivos`;
    return this.http.get<IArchivoInfo[]>(url);
  }

  obtenerArchivosPorTipo(tipoArchivo: string): Observable<IArchivoInfo[]> {
    const url = `${this.urlAPI}/Archivos/archivosPorTipo/${tipoArchivo}`;
    return this.http.get<IArchivoInfo[]>(url);
  }

  borrarTodosLosArchivos(): Observable<void> {
    const url = `${this.urlAPI}/Archivos/borrarArchivos`;
    return this.http.delete<void>(url);
  }
  
    // Método para borrar un archivo específico
    borrarArchivo(archivo: IArchivoInfo): Observable<void> {
      const url = `${this.urlAPI}/Archivos/borrarArchivo/${archivo.nombre}`;
      return this.http.delete<void>(url);
    }

     

}