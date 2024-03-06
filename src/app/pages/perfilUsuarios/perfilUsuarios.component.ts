import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/user.interface';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
    selector: 'app-perfil-usuarios',
templateUrl: './perfilUsuarios.component.html',
styleUrls: ['./perfilUsuarios.component.css']
})
export class PerfilUsuariosComponent  {

    userId: number | undefined; 
    constructor(private usuariosService: UsuariosService) {}

    // usuario$ = this.usuariosService.getDataByPk<IUser>('Usuario')
    usuario$ = this.usuariosService.getUsuariosId(1)
}

