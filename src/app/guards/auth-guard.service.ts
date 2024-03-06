import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { UsuariosComponent } from '../pages/registro/usuarios.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private router: Router) {}

  // Los guards son servicios de Angular que nos permiten vigilar si el usuario tiene derecho a entrar
  // a ciertos sitios. Debemos implementar una función que contraste si el usuario cumple ciertos requisitos
  // En este caso, si en el localStorage hay un objeto usuario, señal de que se ha autenticado
  // Esto sería mejorable, porque podríamos mirar dentro del token el rol del usuario (si el backend lo tenemos
  // programado para devolver esa información). O si en el token hay cierto valor dejarle o no pasar...
  // MUY IMPORTANTE. Este guard no sirve de nada si no se integra en el routing
  isLoggedIn() {
    const user = localStorage.getItem('usuario');
    if (user) {
      return true;
    }

    this.router.navigate(['chat']);
    return false;
  }



  //PARA QUE NO DEJE ENTRAR A COMPONENTES SI NO ERES ADMIN, SE AÑADE AL ROUTING
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['expectedRole'] as string;
    // const expectedRoom = route.data['expectedRoom'] as string;

    const userData = JSON.parse(localStorage.getItem('usuario') || '{}');

    if (userData && userData.rol === expectedRole) {
      return true;

    }

    // if (userData && userData.room === expectedRoom) {
    //   return true;
    // }

    //  OJO!!!! ESTO ES PARA QUE TE LLEVE A CHAT AL INICIAR, SI SE QUITA AVISO DE PRIMENG HAY QUE ACTIVARLO!!!!
    // this.router.navigate(['chat']);
    return false;
  }

  

}