import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, NavigationEnd, Event, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { BaseDatosService } from 'src/app/services/BaseDatos.service';
import { DataService } from 'src/app/services/data.service';
import { LectorService } from 'src/app/services/lector.service';
import { StorageHelper } from 'src/app/services/localstorage.service';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class perfilComponent implements OnInit {
  @Output() avatarCambiado = new EventEmitter<string>();
  avatares: any[] = [];
  selectedFile: File | null = null; //

  avataresBack = [
    {
      nombre: 'Avatar 1',
      url: 'https://avatarfiles.alphacoders.com/120/120060.jpg',
    },
    {
      nombre: 'Avatar 2',
      url: 'https://cdn.icon-icons.com/icons2/1576/PNG/512/3561839-emoji-emoticon-silly_107878.png',
    },
    {
      nombre: 'Avatar 3',
      url: 'https://th.bing.com/th/id/OIP.th8AjwRm63Ooh3XIZg5eAAHaF8?rs=1&pid=ImgDetMain',
    },
    {
      nombre: 'Avatar 4',
      url: 'https://i.pinimg.com/736x/90/05/80/900580e1df8f3a9858736f21dde029fd.jpg',
    },
  ];
 

  usuarios: IUser[] = [];
  usuarioActual: any | IUser[] = [];

  avatars$: Observable<any[]>;
  avatarSubscription: Subscription | undefined;
  avatarLoaded: boolean = false;
  avatarExists: boolean = false;
  avatarUrl2: string = '';

  userData: IUser;
  avatarUrl: string = '';
  salaSeleccionada: string = '';

  textToRead: string = '';



  showModal: boolean = false; // Controla la visibilidad del cuadro de diálogo o modal
  avatarUrlInput: string = ''; // Variable para almacenar la URL de avatar ingresada por el usuario


  constructor(
    private router: Router,
    private dataService: DataService,
    private baseDatosService: BaseDatosService,
    private route: ActivatedRoute,
    private usuariosService: UsuariosService,
    public lectorService: LectorService,
  

  ) {
    this.avatars$ = this.dataService.getAvatars(); 

    this.userData = {
      ...StorageHelper.getItem<IUser>('usuario')!,
      avatar: StorageHelper.getAvatar()!,
    };
  }

  ngOnInit(): void {
    // this.speak();
    this.getUsuarios();
    this.editarUsuario(this.usuarioActual);

    this.salaSeleccionada = this.userData.rol!;
    // this.dataService.clearAvatars();

    this.avatarSubscription = this.dataService.avatars$.subscribe((avatars) => {
      const avatar = avatars.find((avatar) => avatar.id === this.userData.id);
      if (avatar) {
        this.avatarUrl2 = avatar.avatar;
        this.avatarExists = true;
      } else {
        this.avatarExists = false;
      }
      this.avatarLoaded = true;
    });
  }

  ngAfterContentInit(): void {
    this.lectorService.speakperfil();
  }

  getUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
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

  updateUsuariosDatos(usuario: IUser): void {
    const confirmacion = confirm('¿Estás seguro de que deseas actualizar sus datos?');
    if (confirmacion) {
      // this.navbarComponent.userAvatar();
      this.usuariosService.getUsuarios().subscribe({
        next: (data) => {
          const usuarioExistenteNombre = data.find((u) => u.nombre === usuario.nombre && u.id !== usuario.id);
          const usuarioExistenteEmail = data.find((u) => u.email === usuario.email && u.id !== usuario.id);
          if (usuarioExistenteNombre) {
            // Si el nombre ya existe y pertenece a otro usuario
            alert('ERROR: El nombre de usuario ya existe en la base de datos.');
          } else if (usuarioExistenteEmail) {
            // Si el email ya existe y pertenece a otro usuario
            alert('ERROR: El correo electrónico ya está registrado en la base de datos.');
          } else {
            // Si el nombre y el email no existen en la base de datos o pertenecen al mismo usuario
            this.usuariosService.updateUsuarios(usuario).subscribe({
              next: () => {
                alert('Datos actualizados correctamente');
                // Emitir el evento con la nueva URL del avatar
                this.avatarCambiado.emit(usuario.avatar);
                this.showModal = false;
              },
              error: () => {
                alert('Error al actualizar los datos');
              },
            });
          }
        },
        error: () => {
          alert('Error en el acceso a datos');
        },
      });
    }
  }


  editarUsuario(usuario: any) {
    this.usuarioActual = usuario;
  }

  guardarAvatar(): void {
    if (
      this.avatarUrl.trim() !== 'https://sstc.ac.in/img2/faculty/faculty.jpg'
    ) {
      StorageHelper.setAvatar(this.avatarUrl);
      this.userData.avatar = this.avatarUrl;
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        const avatar = {
          id: this.userData.id, 
          avatar: e.target.result,
        };
        this.dataService.addOrUpdateAvatar(avatar);
      };
    }
  }

  ngOnDestroy(): void {
    if (this.avatarSubscription) {
      this.avatarSubscription.unsubscribe();
    }
  }

  getAvatarUrl(): string {
    if (this.avatarExists) {
      return this.avatarUrl2;
    } else {
      return 'https://sstc.ac.in/img2/faculty/faculty.jpg';
    }
  }

  // speak() {
  //   if ('speechSynthesis' in window) {
  //     const mainContent =
  //       document.getElementById('descripcion-perfil')?.innerText;
  //     const speech = new SpeechSynthesisUtterance(mainContent);
  //     window.speechSynthesis.speak(speech);
  //   } else {
  //     alert('Tu navegador no soporta la síntesis de voz.');
  //   }
  // }
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
    const confirmacion = confirm('¿Estás seguro de que deseas actualizar su contraseña?');
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


  openAvatarUrlDialog(): void {
    this.showModal = true;
  }

  closeAvatarUrlDialog(): void {
    this.showModal = false;
  }

  setAvatarUrl(): void {
    this.usuarioActual.avatar = this.avatarUrlInput;
    this.showModal = false;
  }



}
