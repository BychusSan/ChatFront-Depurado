import { Component, OnInit } from '@angular/core';
import { IArchivoInfo } from 'src/app/interfaces/arhivos.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { ArchivosService } from 'src/app/services/archivos.service';
import { StorageHelper } from 'src/app/services/localstorage.service';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css'],
})
export class ArchivosComponent implements OnInit {
  categoriasArchivos: { [key: string]: string[] } = {
    Multimedia: ['Image', 'Video', 'Audio'],
    Documentos: [
      'Pdf',
      'Text',
      'msword',
      'vnd.ms-excel',
      'vnd.ms-powerpoint',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    Código: [
      'application/x-typescript',
      'text/x-csharp',
      'json',
      'html',
      'css',
      'javascript',
      'xml',
    ],
    'Archivos comprimidos': ['octet-stream', 'x-zip-compressed'],
  };

  mostrarCardEliminar: boolean = false;
  archivoSeleccionado: IArchivoInfo | null = null;
  
  salaSeleccionada: string | null = null;
  salas: string[] = [];
  archivos: IArchivoInfo[] = [];

  tiposArchivos: string[] = ['Seleccione un tipo de archivo', 'Image'];

  tipoArchivoSeleccionado: string | null = null;
  userData: IUser;

  constructor(private archivosService: ArchivosService) {
    this.tipoArchivoSeleccionado = this.tiposArchivos[0];

    this.userData = {
      ...StorageHelper.getItem<IUser>('usuario')!,
      avatar: StorageHelper.getAvatar()!,
    };
  }

  ngOnInit(): void {
    this.userData = {
      ...StorageHelper.getItem<IUser>('usuario')!,
      avatar: StorageHelper.getAvatar()!,
    };
    //  this.obtenerArchivosPorTipo(this.tipoArchivoSeleccionado!);
  }

  onChangeTipoArchivo(): void {
    if (this.tipoArchivoSeleccionado) {
      this.obtenerArchivosPorTipo(this.tipoArchivoSeleccionado);
    }
  }

  obtenerCategorias(): string[] {
    return Object.keys(this.categoriasArchivos);
  }

  obtenerArchivosPorTipo(tipoArchivo: string): void {
    if (this.tipoArchivoSeleccionado) {
      this.archivosService
        .obtenerArchivosPorTipo(this.tipoArchivoSeleccionado)
        .subscribe((archivos: IArchivoInfo[]) => {
          this.archivos = archivos;
        });
    }
  }

  borrarArchivo(archivo: IArchivoInfo): void {
    this.archivosService.borrarArchivo(archivo).subscribe(
      () => {
        console.log('Archivo borrado correctamente:', archivo.nombre);
        // OJO: con esto actualizamos la lista de archivos después de borrar
        this.obtenerArchivosPorTipo(this.tipoArchivoSeleccionado!);
      },
      (error) => {
        console.error('Error al borrar archivo:', error);
      }
    );
  }

  mostrarConfirmacion(archivo: IArchivoInfo): void {
    this.archivoSeleccionado = archivo;
    this.mostrarCardEliminar = true;
  }
  
  confirmarEliminacion(archivo: IArchivoInfo | null): void {
    if (archivo) {
      this.borrarArchivo(archivo);
    }
    this.cancelarEliminacion();
  }
  
  
  cancelarEliminacion(): void {
    this.mostrarCardEliminar = false;
    this.archivoSeleccionado = null;
  }

  getNombreMostrar(tipoArchivo: string): string {
    switch (tipoArchivo) {
      case 'Image':
        return 'Imagen';
      case 'Pdf':
        return 'Documento PDF';
      case 'Text':
        return 'Archivo de texto';
      case 'Video':
        return 'Archivo de video';
      case 'Audio':
        return 'Archivo de audio';
      case 'application/vnd.oasis.opendocument.text':
        return 'Documento de LibreOffice (Texto)';
      case 'application/vnd.oasis.opendocument.spreadsheet':
        return 'Documento de LibreOffice (Hoja de cálculo)';
      case 'application/vnd.oasis.opendocument.presentation':
        return 'Documento de LibreOffice (Presentación)';
      case 'octet-stream':
        return 'Archivo RAR';
      case 'x-zip-compressed':
        return 'Archivo ZIP';
      case 'msword':
        return 'Documento de Microsoft Word';
      case 'vnd.ms-excel':
        return 'Documento de Microsoft Excel';
      case 'vnd.ms-powerpoint':
        return 'Presentación de Microsoft PowerPoint';
      case 'json':
        return 'Archivo JSON';
      case 'html':
        return 'Documento HTML';
      case 'css':
        return 'Hoja de estilo CSS';
      case 'javascript':
        return 'Archivo JavaScript';
      case 'xml':
        return 'Documento XML';
      case 'application/x-typescript':
        return 'Archivo TypeScript';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'Documento de Microsoft Word (DOCX)';
      default:
        return tipoArchivo;
    }
  }
}
