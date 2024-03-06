export interface IUser {
    id?: number;
    nombre?: string;
    email?: string;
    password?: string;
    rol?: string;
    room?: string;
    token?: string;
    avatar?: string;
    nuevaPassword?: string;
    fechaRegistro?: Date;
    fechaUpdate?: Date;
    lastConnection?: Date;

  }
  
  export interface ITokenInfo {
    nombre: string;
    email: string;
    token: string;
    rol: string;
    room: string;
    avatar?: string;
    FechaUpdate?: Date;
    lastConnection?: Date;
  }