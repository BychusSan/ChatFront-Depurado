import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseDatosService {

  constructor(private dbService: NgxIndexedDBService) { }
  

  // SERVIDOR FRONT INDEXDB BUGEADO

  guardarAvatar(avatar: any): Observable<any> {
    return this.dbService.add('avatars', avatar);
  }

  obtenerAvatares(): Observable<any[]> {
    return this.dbService.getAll('avatars');
  }


  
}