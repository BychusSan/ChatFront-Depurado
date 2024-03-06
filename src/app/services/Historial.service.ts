import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IHistorial } from '../interfaces/historial.interface';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  // private urlAPI= 'https://localhost:7217/api'; 
  urlAPI = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getHistorialChat(room: string): Observable<IHistorial[]> {
    const url = `${this.urlAPI}/Salas/historial/${room}`; 
    return this.http.get<IHistorial[]>(url);
  }



  getSalasDisponibles(): Observable<string[]> {
    const url = `${this.urlAPI}/Salas/salas-disponibles`;
    return this.http.get<string[]>(url);
  }
}
