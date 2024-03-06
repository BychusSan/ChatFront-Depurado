import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/user.interface';
import { ArchivosService } from 'src/app/services/archivos.service';
import { LoginService } from 'src/app/services/login.service';
import { UserChatService } from 'src/app/services/UserChat.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuario: IUser = {
    nombre: '',
    email: '',
    password: '',
    rol: '',
    room: '',
    id:0,
    avatar: 'https://cdn-icons-png.flaticon.com/256/456/456141.png',
    
    
  };

  usuarios: IUser[] = [];
  

  constructor(private usuariosService: UsuariosService, private loginService: LoginService, private router: Router,
    private userChatService: UserChatService, private archivosService: ArchivosService) 
    {}


  ngOnInit(): void {
    this.getUsuarios();

  }


  handleAction(event: any, usuario: IUser) {
    const action = event.target.value;
    switch (action) {
      case 'update':
        this.updateUsuarios(usuario);
        break;
      case 'delete':
        this.deleteUsuarios(usuario);
        break;
      case 'changePassword':
        this.changePassword(usuario);
        break;
      default:   
        break;
    }
  }



  getUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        
      console.log('Usuarios obtenidos en UsuariosComponent:', data);
      this.userChatService.actualizarUsuariosConectados(data);
      
      },
      error: (err) => {
        alert('Error en el acceso a datos');
      }
    });
  }

  addUsuarios() {
     // Verificar si algún campo está vacío
  if (!this.usuario.nombre || !this.usuario.email || !this.usuario.password || !this.usuario.rol || !this.usuario.room) {
    alert('Por favor, complete todos los campos.');
    return; // Detener el proceso si algún campo está vacío
  }
    this.usuariosService.addUsuarios(this.usuario).subscribe({
      next: (data) => {
        this.usuario.nombre = '';
        this.usuario.email = '';
        this.usuario.password = '';
        this.usuario.rol = '';
        this.usuario.room = '';
        this.usuario.avatar= 'https://cdn-icons-png.flaticon.com/256/456/456141.png';
        alert('Alta realizada con éxito');
      },
      error: (err) => {
        alert('ERROR: El nombre/email ya está en uso, o el servidor ha dejado de responder');
      },
      complete: () => {
        this.getUsuarios();
      }
    });
  }


  updateUsuarios(usuario: IUser): void {
    const confirmacion = confirm('¿Estás seguro de que deseas actualizar este usuario?');
    if (confirmacion) {
      this.usuariosService.updateUsuarios(usuario).subscribe({
        next: () => {
          
          alert('Usuario actualizado correctamente');
        },
        error: () => {
          alert('Error al actualizar el usuario');
        }
      });
    }
  }
  
  changePassword(usuario: IUser): void {
    const confirmacion = confirm('¿Estás seguro de que deseas actualizar este usuario?');
    if (confirmacion) {
      this.usuariosService.changePassword(usuario).subscribe({
        next: () => {
          alert('Contraseña actualizada correctamente');
        },
        error: () => {
          alert('Error al actualizar la contraseña');
        }
      });
    }
  }

  deleteUsuarios(usuario: IUser): void {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este usuario?');
      if (confirmacion) {
      this.usuariosService.deleteUsuarios(usuario).subscribe({
        next: (response) => {
          console.log('Usuario eliminado correctamente', response);
          alert('Usuario eliminado correctamente');  
        },
        error: (error) => {
          console.error('Error al eliminar el usuario', error);
          alert('Error al eliminar el usuario');
        },
        complete: () => {
          this.getUsuarios();
        }
      });
    }
  }



  borrarArchivos(): void {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar todos los archivos?');
    if (confirmacion) {
      this.archivosService.borrarTodosLosArchivos().subscribe({
        next: () => {
          console.log('Archivos eliminados correctamente');
          alert('Archivos eliminados correctamente'); 
        },
        error: () => {
          console.error('Error al eliminar archivos:');      
          alert('Archivos eliminados correctamente'); 
   
         }
      });
    }
  }
  borrarLista(): void {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar la lista de usuarios conectados?');
    if (confirmacion) {
      this.loginService.disconnectAllUsers().subscribe({
        next: () => {
          console.log('Lista eliminada correctamente');
          alert('Lista eliminada correctamente'); 
        },
        error: () => {
          console.error('Error al eliminar la lista');      
          alert('Error al eliminar la lista'); 
   
         }
      });
    }
  }
  

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }
  chat() {
    this.router.navigateByUrl('/chat');
  }


}
