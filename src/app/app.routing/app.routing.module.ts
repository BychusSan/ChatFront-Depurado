import { NgModule, inject } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../guards/auth-guard.service';
import { LoginComponent } from '../pages/login/login.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { ChatComponent } from '../pages/PruebaChat/chat.component';
import { UsuariosComponent } from '../pages/registro/usuarios.component';
import { PrincipalComponent } from '../pages/principal/principal.component';
import { HistorialComponent } from '../pages/historial/historial.component';
import { InicioComponent } from '../pages/inicio/inicio.component';
import { perfilComponent } from '../pages/perfil/perfil.component';
import { ArchivosComponent } from '../pages/archivos/archivos.component';
import { PerfilUsuariosComponent } from '../pages/perfilUsuarios/perfilUsuarios.component';
import { Sala1Component } from '../pages/sala1/sala1.component';
import { Sala2Component } from '../pages/sala2/sala2.component';
import { Sala3Component } from '../pages/sala3/sala3.component';
import { Sala4Component } from '../pages/sala4/sala4.component';
import { Sala5Component } from '../pages/sala5/sala5.component';
import { Sala6Component } from '../pages/sala6/sala6.component';


// Esta línea conecta el sistema de rutas con el guard (algo así como el vigilante).
// isLoggedin será un método del AuthGuardService que se encargará de validar si el usuario está loggeado.
export const canActivate = (authGuard: AuthGuardService = inject(AuthGuardService)) => authGuard.isLoggedIn();

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [() => canActivate()] // Aquí se le pasa el método que valida si el usuario está loggeado.
    // canActivate "abrritá la puerta" dependiendo de lo que el canActivate del AuthGuardService devuelva.
  },

{
  path: 'sala1',
  component: Sala1Component,
  canActivate: [() => canActivate()] // Aquí se le pasa el método que valida si el usuario está loggeado.
  // canActivate "abrritá la puerta" dependiendo de lo que el canActivate del AuthGuardService devuelva.
},
{
  path: 'sala2',
  component: Sala2Component,
  canActivate: [() => canActivate()] // Aquí se le pasa el método que valida si el usuario está loggeado.
  // canActivate "abrritá la puerta" dependiendo de lo que el canActivate del AuthGuardService devuelva.
},
{
  path: 'sala3',
  component: Sala3Component,
  canActivate: [() => canActivate()] // Aquí se le pasa el método que valida si el usuario está loggeado.
  // canActivate "abrritá la puerta" dependiendo de lo que el canActivate del AuthGuardService devuelva.
},
{
  path: 'sala4',
  component: Sala4Component,
  canActivate: [() => canActivate()] // Aquí se le pasa el método que valida si el usuario está loggeado.
  // canActivate "abrritá la puerta" dependiendo de lo que el canActivate del AuthGuardService devuelva.
},
{
  path: 'sala5',
  component: Sala5Component,
  canActivate: [() => canActivate()] // Aquí se le pasa el método que valida si el usuario está loggeado.
  // canActivate "abrritá la puerta" dependiendo de lo que el canActivate del AuthGuardService devuelva.
},
{
  path: 'sala6',
  component: Sala6Component,
  canActivate: [() => canActivate()] // Aquí se le pasa el método que valida si el usuario está loggeado.
  // canActivate "abrritá la puerta" dependiendo de lo que el canActivate del AuthGuardService devuelva.
},

{
    path: 'registro',
    component: UsuariosComponent,
    canActivate: [AuthGuardService],
    data: {
      expectedRole: 'admin',
    }
  },

  {
    path: 'historial',
    component: HistorialComponent,
    canActivate: [() => canActivate()] 
 
  },
  {
    path: 'perfil',
    component: perfilComponent,
    canActivate: [() => canActivate()] 
   
  },
  {
    path: 'archivos',
    component: ArchivosComponent,
    canActivate: [() => canActivate()]
   
  },
  // {
  //   path: 'archivos',
  //   component: UsuariosComponent,
  //   canActivate: [AuthGuardService],
  //   data: {
  //     expectedRole: 'admin'
  //   }
  // },

  { path: 'perfil-usuarios/:id', component: PerfilUsuariosComponent},  
  
  // { path: 'inicio', component: InicioComponent},

  { path: '**', component: NotFoundComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}