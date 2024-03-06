
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import 'prismjs';
import { LectorService } from 'src/app/services/lector.service';

declare var Prism: any;
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit, AfterViewInit {
  currentSection: string = ''; // Asegúrate de inicializarla con un valor adecuado
  // Esta debería contener el código que quieres mostrar
  codeForClases: string = `
public class Connection
{
    public string Id { get; set; }
    public string User { get; set; }
    public string Avatar { get; set; }
    public string Room { get; set; }
}

public class Message
{
    public string User { get; set; }
    public string Text { get; set; }
    public string Avatar { get; set; }
    public string Room { get; set; }
    public int? Id { get; set; }    
    public DateTime Fecha { get; set; }
}

public class ResultadoHash
{
    public string Hash { get; set; }
    public byte[] Salt { get; set; }
}`;
  codeForComponentes: string = '';
  items?: MenuItem[];

  constructor(public lectorService: LectorService) {}

  ngOnInit() {
    this.lectorService.speakTextos();
    this.items = [
      {
        label: 'Backend',
        items: [
          { label: 'resumen', command: () => this.navigateTo('resumen') },
          { label: 'Clases', command: () => this.navigateTo('clases') },
          { label: 'Hub', command: () => this.navigateTo('hub') },
          {
            label: 'Controladores',
            command: () => this.navigateTo('controladores'),
          },
          { label: 'Servicios', command: () => this.navigateTo('servicios') },
        ],
      },
      {
        label: 'Frontend',
        items: [
          {
            label: 'Componentes',
            command: () => this.navigateTo('componentes'),
          },
          {
            label: 'Servicios',
            command: () => this.navigateTo('serviciosFront'),
          },
          { label: 'Directivas', command: () => this.navigateTo('directivas') },
          { label: 'Módulos', command: () => this.navigateTo('modulos') },
        ],
      },
      {
        label: 'Instalacion',
        items: [
          {
            label: 'Angular-instalación',
            command: () => this.navigateTo('Angular-instalación'),
          },
          {
            label: 'asp core y signalR',
            command: () => this.navigateTo('Asp core y signalR'),
          },
        ],
      },
      {
        label: 'Base de datos',
        items: [
          { label: 'Tablas', command: () => this.navigateTo('componentes') },
        ],
      },
      {
        label: 'Presentacion',
        items: [
          { label: 'signalR', command: () => this.navigateTo('signalR') },
          { label: 'Angular', command: () => this.navigateTo('Angular') },
          { label: 'Seguridad', command: () => this.navigateTo('Seguridad') },
          {
            label: 'chatPresentation',
            command: () => this.navigateTo('chatPresentation'),
          },
        ],
      },
    ];
  }

  ngAfterViewInit() {
    Prism.highlightAll();
  }

  navigateTo(section: string) {
    this.currentSection = section;
  }

  // Función para copiar el código de ejemplo
  copyCode(code: string) {
    navigator.clipboard
      .writeText(code)
      .then()
      .catch((e) => console.error(e));
    alert('Código copiado al portapapeles!');
  }
}
