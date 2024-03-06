// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { IMessage } from '../interfaces/message.interface';
// import { IUser } from '../interfaces/user.interface';
// import { LoginService } from './login.service';
// import { SignalRService } from './signalr.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class FileDataService {
//   private imageSubject: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
//   public image$: Observable<string | undefined> = this.imageSubject.asObservable();
//   currentUser: IUser;

//   constructor(
//     private loginService: LoginService,
//     private signalrService: SignalRService

//   ) {
//     this.imageSubject.next(this.loadImageFromStorage());

//     this.currentUser = this.loginService.getUserLogged()!;

//   }

//   getImage(): Observable<string | undefined> {
//     return this.image$;
//   }


  
//   onFileSelected(event: any): void {
//     const file: File = event.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       this.addImage(imageUrl);
  
//       // genera mensaje para el chat con enlace de descarga
//       const message: IMessage = {
//         user: `${this.currentUser.nombre} `,
//         // text: 'Imagen adjunta',
//         // text: `<a href="${imageUrl}" download="archivo_descargado" >Descargar archivo</a>`,
//         text: `<a href="${imageUrl}" download="" >Descargar archivo</a>`,
//         avatar: '',
//         room: this.currentUser.rol!,
//         file: imageUrl, // Cambiar para que contenga la URL de la imagen
//         id: this.currentUser.id,
//       };
  
//       // Llamar al método sendMessage para enviar el mensaje al chat
//       this.signalrService.sendMessage(message);
  
//       console.log('Imagen seleccionada y enviada al chat:', message); // Agrega este console.log
//     }
//   }
 

//   addImage(imageUrl: string): void {
//     this.imageSubject.next(imageUrl);
//     this.saveImageToStorage(imageUrl);
//     console.log('Archivo agregado:', imageUrl);
    
//   }

//   private loadImageFromStorage(): string | undefined {
//     const imageUrl = localStorage.getItem('image');
//     return imageUrl ? imageUrl : undefined;
//   }

//   private saveImageToStorage(imageUrl: string): void {
//     localStorage.setItem('image', imageUrl);
//   }

//   //   getLastImageName(): string | undefined {
// //     const currentImages = this.imagesSubject.getValue();
// //     return currentImages.length > 0 ? currentImages[currentImages.length - 1].split('/').pop() : undefined;
// //   }
// }






import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileDataService {

  urlAPI = environment.urlAPI;

  constructor(private http: HttpClient) { }

  // uploadFile(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   return this.http.post(this.urlAPI + '/upload/file', formData);
  // }
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(this.urlAPI + '/upload/file', formData);
    // return this.http.post(this.urlAPI + '/upload/file', formData);

  }



}
