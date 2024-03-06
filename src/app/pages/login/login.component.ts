import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../services/login.service';
import { AuthGuardService } from 'src/app/guards/auth-guard.service';
import { IUser } from 'src/app/interfaces/user.interface';
import { StorageHelper } from 'src/app/services/localstorage.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: IUser = {
    email: '',
    password: '',
  };
  messages: any[] = [];


  constructor(private loginService: LoginService, private router: Router, private authGuardServide: AuthGuardService,
    private messageService: MessageService,
    ) 
  {
  }

  ngOnInit() {
  
  }

  login() {
    this.loginService.login(this.usuario).subscribe({
      next: (data) => {
        localStorage.setItem('usuario', JSON.stringify(data));
        this.messageService.add({
          severity: 'success',
          summary: 'Iniciar Sesión',
          detail: 'Se inició sesión exitosamente.',
          life: 2000,
        });
  
        // Detectar el tipo de sala y dirigir al componente correspondiente
        const roomType = data.room; // Suponiendo que el tipo de sala está en la propiedad 'room' de 'data'
        let destinationComponent: string;
  
        switch(roomType) {
          case 'Conjunta':
            destinationComponent = 'chat';
            break;
          case 'Sala 1':
            destinationComponent = 'sala1';
            break;
            case 'Sala 2':
              destinationComponent = 'sala2';
              break;
              case 'Sala 3':
                destinationComponent = 'sala3';
                break;
                case 'Sala 4':
                  destinationComponent = 'sala4';
                  break;
                  case 'Sala 5':
                    destinationComponent = 'sala5';
                    break;
                    case 'Sala 6':
                      destinationComponent = 'sala6';
                      break;
          // Agregar más casos según los tipos de sala que manejes
          default:
            destinationComponent = 'chat'; // O el componente por defecto que desees
        }
  
        setTimeout(() => {
          this.router.navigateByUrl(destinationComponent);
        }, 2000);
      },
      error: (err) => {
        alert('Credenciales erróneas');
      },
      complete: () => {}
    });
  }
  
  

}