// principal.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/user.interface';
import { LectorService } from 'src/app/services/lector.service';
import { StorageHelper } from 'src/app/services/localstorage.service';
import { LoginService } from 'src/app/services/login.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {
  navigateTo(sectionId: string): void {
    window.location.href = sectionId;
  }

  sidebarOpen: boolean = true;

  usuarios: IUser[] = [];

  // userData: IUser = {
  //   email:"",
  //   password:"",
  //   nombre:"",
  //   rol:"",
  // };

  // salaSeleccionada: string = ''; 

  constructor(private usuariosService: UsuariosService, private loginService: LoginService, private router: Router, public lectorService: LectorService) 
  {
    // this.userData = StorageHelper.getItem<IUser>('usuario')!;
    // this.salaSeleccionada = this.userData.rol!;
  }


  // ngOnInit(): void {
  //   this.getUsuarios();
  // }

  toggleSidebar() {
    const contenedorBotones = document.getElementById("contenedor-botones")!;
    const contenedorContenido = document.getElementById("contenedor-contenido")!;

    if (contenedorBotones.style.width === "200px") {
      contenedorBotones.style.width = "0";
      contenedorContenido.style.marginLeft = "0px";
    } else {
      contenedorBotones.style.width = "200px";
      // contenedorContenido.style.marginLeft = "50px";
    }
  }
  getUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        alert('Error en el acceso a datos');
      }
    });
  }


  
  registrar() {
    this.router.navigateByUrl('registro');
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
  isLoggedIn(): boolean {
    return localStorage.getItem('usuario') !== null;
  }
}