import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IHistorial } from 'src/app/interfaces/historial.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { HistorialService } from 'src/app/services/Historial.service';
import { StorageHelper } from 'src/app/services/localstorage.service';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  historial: IHistorial[] = [];
  // salas: string[] = [];
  salaSeleccionada: string | null = 'Seleccione sala';
  fechaInicio: string = '';
  fechaFin: string = '';

  rangoFechas: string = ''; // inicializa rangoFechas

  input2desactivado: boolean = true;

  usuarioActual: any | IUser[] = [];
  userData: IUser;
  salas: any | IUser[] = '';

  
  constructor(private historialService: HistorialService, 
    private router: Router,
    private usuariosService: UsuariosService 
    ) {
      this.userData = {
        ...StorageHelper.getItem<IUser>('usuario')!,
        avatar: StorageHelper.getAvatar()!,
      };
     }



  ngOnInit(): void {
    this.getCurrentUser();
    this.getSalasDisponibles();
  }

  getCurrentUser() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        // OJO: con essto filtramos la lista de usuarios para encontrar el que coincide con userData.nombre
        const usuarioActual = data.find(
          (usuario) => usuario.nombre === this.userData.nombre
        );

        if (usuarioActual) {
          this.usuarioActual = usuarioActual;
        } else {
          console.error(
            'No se encontró el usuario actual en la lista de usuarios.'
          );
        }

        console.log(
          'Usuario actual obtenido en UsuariosComponent:',
          this.usuarioActual
        );
      },
      error: (err) => {
        alert('Error en el acceso a datos');
      },
    });
  }


  getHistorialChat(): void {
    if (!this.salaSeleccionada) {
      console.error('Seleccione una sala antes de obtener el historial del chat.');
      return;
    }


    if (!this.fechaInicio) {
      console.error('Seleccione una fecha para filtrar el historial.');
      return;
    }
    

    this.historialService.getHistorialChat(this.salaSeleccionada).subscribe(
      historial => {
        this.historial = historial.filter(mensaje => this.esMismoDia(new Date(mensaje.fechaMensaje), new Date(this.fechaInicio)));
        console.log(this.historial);
      },

      error => {
        console.error('Error al obtener el historial del chat:', error);
      }
    );
  }

  getHistorialChat2(): void {
    if (!this.salaSeleccionada) {
      console.error('Seleccione una sala antes de obtener el historial del chat.');
      return;
    }
  
    if (!this.fechaInicio || !this.fechaFin) {
      console.error('Seleccione un rango de fechas para filtrar el historial.');
      return;
    }
  
    const fechaInicio = new Date(this.fechaInicio);
    const fechaFin = new Date(this.fechaFin);
    fechaFin.setDate(fechaFin.getDate() + 1); 
    this.historialService.getHistorialChat(this.salaSeleccionada).subscribe(
      historial => {
        this.historial = historial.filter(mensaje => {
          const mensajeFecha = new Date(mensaje.fechaMensaje);
          return mensajeFecha >= fechaInicio && mensajeFecha < fechaFin; 
        });
        console.log('Historial filtrado:', this.historial);
      },
      error => {
        console.error('Error al obtener el historial del chat:', error);
      }
    );
  }

  

  esMismoDia(fecha1: Date, fecha2: Date): boolean {
    return fecha1.getFullYear() === fecha2.getFullYear() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getDate() === fecha2.getDate();
  }

 

  getSalasDisponibles(): void {
    this.historialService.getSalasDisponibles().subscribe(
      salas => {
        this.salas = salas; 
        const primeraSala = this.salas.length > 0 ? this.getLabelForSala(this.salas[0]) : null;
        this.salaSeleccionada = null;
      },
      error => {
        console.error('Error al obtener la lista de salas:', error);
      }
    );
  }

  getLabelForSala(sala: string): string {
    const room = this.usuarioActual.room;
    if (room === 'Conjunta') {
      return sala; // Si el usuario está en la sala "Conjunta", devuelve el nombre de la sala
    } else if (sala === room || sala === 'Conjunta') {
      return sala; // Si la sala es la misma que la del usuario o es "Conjunta", devuelve el nombre de la sala
    } else {
      return '';
    }
  }

  getSalasVisibles(): string[] {
    const room = this.usuarioActual.room;
    if (room === 'Conjunta') {
      return this.salas;
    } else {
      const salasVisibles = this.salas.filter((sala: string) => sala === room);
      salasVisibles.push('Conjunta'); // Agregar la opción "Conjunta" a las salas visibles
      return salasVisibles;
    }
  }
  
  
  
  salaCoincideConUsuario(sala: string): boolean {
    const room = this.usuarioActual.room; 
    return room === 'Conjunta' || sala === room;
  }
  




  onChangeRoom(): void {
    this.getHistorialChat();
  }

  chat() {
    this.router.navigateByUrl('/chat');
  }



  descargarHistorial(): void {
    if (this.historial.length === 0 || !this.salaSeleccionada || !this.fechaInicio) {
      console.error('No hay historial para descargar o falta información.');
      return;
    }
  
    const nombreDia = this.getNombreDia();
    const nombreSala = this.getLabelForSala(this.salaSeleccionada);
    const nombreArchivo = `${nombreSala}_${nombreDia}_historial.txt`;
  
    const contenido = this.generarContenidoHistorial();
  
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
  
    document.body.appendChild(a);
    a.click();
  
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  
  getNombreDia(): string {
    const fechaSeleccionada = new Date(this.fechaInicio);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions;
    return fechaSeleccionada.toLocaleDateString('es-ES', options);
  }
  
  generarContenidoHistorial(): string {
    const contenido = this.historial.map(mensaje => {

     return ` [${mensaje.fechaMensaje}] -- [${mensaje.rol}] - ${mensaje.nombre} >>>>   ${mensaje.texto}   `;

    }).join('\n');
    return contenido;
  }

  activarInputFecha() {
    this.input2desactivado = !this.salaSeleccionada; // desactiva el input si no hay una sala seleccionada
  }
  

}
