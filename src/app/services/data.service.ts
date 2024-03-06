import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private avatarsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public avatars$: Observable<any[]> = this.avatarsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.avatarsSubject.next(this.loadAvatarsFromStorage());
  }

  getAvatars(): Observable<any[]> {
    return this.avatars$;
  }

  addOrUpdateAvatar(avatar: any): void {
    const currentAvatars = this.avatarsSubject.getValue();
    const existingIndex = currentAvatars.findIndex(a => a.id === avatar.id);

    if (existingIndex !== -1) {
      currentAvatars[existingIndex] = avatar;
    } else {
      currentAvatars.push(avatar);
    }

    this.avatarsSubject.next(currentAvatars);
    this.saveAvatarsToStorage(currentAvatars);

    console.log('Avatar actualizado o agregado:', avatar);
    console.log('Avatares actualizados:', currentAvatars);
  }

  clearAvatars(): void {
    this.avatarsSubject.next([]);
    localStorage.removeItem('avatars');
    console.log('Avatares eliminados del almacenamiento.');
  }


  private loadAvatarsFromStorage(): any[] {
    const avatarsJson = localStorage.getItem('avatars');
    const avatars = avatarsJson ? JSON.parse(avatarsJson) : [];
    console.log('Avatares cargados desde el almacenamiento:', avatars);
    return avatars;
  }

  private saveAvatarsToStorage(avatars: any[]): void {
    localStorage.setItem('avatars', JSON.stringify(avatars));
    console.log('Avatares guardados en el almacenamiento:', avatars);
  }
}
