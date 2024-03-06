import { Injectable } from "@angular/core";
import { IMessage } from "../interfaces/message.interface";

@Injectable({
    providedIn: 'root'
  })

export class StorageHelper {

    public static setItem(key: string, value: any, useSessionStorage: boolean = false): void {
      const storage = useSessionStorage ? sessionStorage : localStorage;
  
      storage.setItem(key, JSON.stringify(value));
    }
  
    public static getItem<T>(key: string, useSessionStorage: boolean = false): T | null {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const item = storage.getItem(key);
  
      return item ? JSON.parse(item) : null;
    }
  
    public static removeItem(key: string, useSessionStorage: boolean = false): void {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      storage.removeItem(key);
    }
  
    public static clear(useSessionStorage: boolean = false): void {
      const storage = useSessionStorage ? sessionStorage : localStorage;
  
      storage.clear();
    }


    public static setAvatar(avatar: string, useSessionStorage: boolean = false): void {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      storage.setItem('avatar', avatar);
    }
  

    public static getAvatar(useSessionStorage: boolean = false): string {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const storedAvatar = storage.getItem('avatar');
      return storedAvatar ? storedAvatar : 'https://cdn.icon-icons.com/icons2/3446/PNG/512/account_profile_user_avatar_icon_219236.png';
    }

    public static removeAvatar(useSessionStorage: boolean = false): void {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      storage.removeItem('avatar');
    }

    public static guardarMensaje(mensaje: { usuario: string, mensaje: string }[], useSessionStorage: boolean = false): void {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages', useSessionStorage) || [];
      
      // Agregar timestam a los mensajes
      const mensajesConTimestamp = mensaje.map(m => ({ ...m, timestamp: Date.now() }));
      mensajesGuardados.push(...mensajesConTimestamp);
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      storage.setItem('chatMessages', JSON.stringify(mensajesFiltrados));
    }
  
    public static obtenerMensajes(useSessionStorage: boolean = false): { usuario: string, mensaje: string }[] {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages', useSessionStorage) || [];
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      // Obtener SOLO el contenido del mensaje y el usuario
      const mensajes = mensajesFiltrados.map(m => ({ usuario: m.usuario, mensaje: m.mensaje }));
  
      return mensajes;
    }

    public static guardarMensaje1(mensaje: { usuario: string, mensaje: string }[], useSessionStorage: boolean = false): void {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages1', useSessionStorage) || [];
      
      // Agregar timestam a los mensajes
      const mensajesConTimestamp = mensaje.map(m => ({ ...m, timestamp: Date.now() }));
      mensajesGuardados.push(...mensajesConTimestamp);
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      storage.setItem('chatMessages1', JSON.stringify(mensajesFiltrados));
    }
  
    public static obtenerMensajes1(useSessionStorage: boolean = false): { usuario: string, mensaje: string }[] {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages1', useSessionStorage) || [];
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      // Obtener SOLO el contenido del mensaje y el usuario
      const mensajes = mensajesFiltrados.map(m => ({ usuario: m.usuario, mensaje: m.mensaje }));
  
      return mensajes;
    }
    public static guardarMensaje2(mensaje: { usuario: string, mensaje: string }[], useSessionStorage: boolean = false): void {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages2', useSessionStorage) || [];
      
      // Agregar timestam a los mensajes
      const mensajesConTimestamp = mensaje.map(m => ({ ...m, timestamp: Date.now() }));
      mensajesGuardados.push(...mensajesConTimestamp);
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      storage.setItem('chatMessages2', JSON.stringify(mensajesFiltrados));
    }
  
    public static obtenerMensajes2(useSessionStorage: boolean = false): { usuario: string, mensaje: string }[] {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages2', useSessionStorage) || [];
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      // Obtener SOLO el contenido del mensaje y el usuario
      const mensajes = mensajesFiltrados.map(m => ({ usuario: m.usuario, mensaje: m.mensaje }));
  
      return mensajes;
    }
    public static guardarMensaje3(mensaje: { usuario: string, mensaje: string }[], useSessionStorage: boolean = false): void {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages3', useSessionStorage) || [];
      
      // Agregar timestam a los mensajes
      const mensajesConTimestamp = mensaje.map(m => ({ ...m, timestamp: Date.now() }));
      mensajesGuardados.push(...mensajesConTimestamp);
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      storage.setItem('chatMessages3', JSON.stringify(mensajesFiltrados));
    }
  
    public static obtenerMensajes3(useSessionStorage: boolean = false): { usuario: string, mensaje: string }[] {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages3', useSessionStorage) || [];
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      // Obtener SOLO el contenido del mensaje y el usuario
      const mensajes = mensajesFiltrados.map(m => ({ usuario: m.usuario, mensaje: m.mensaje }));
  
      return mensajes;
    }

    public static guardarMensaje4(mensaje: { usuario: string, mensaje: string }[], useSessionStorage: boolean = false): void {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages4', useSessionStorage) || [];
      
      // Agregar timestam a los mensajes
      const mensajesConTimestamp = mensaje.map(m => ({ ...m, timestamp: Date.now() }));
      mensajesGuardados.push(...mensajesConTimestamp);
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      storage.setItem('chatMessages4', JSON.stringify(mensajesFiltrados));
    }
  
    public static obtenerMensajes4(useSessionStorage: boolean = false): { usuario: string, mensaje: string }[] {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages4', useSessionStorage) || [];
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      // Obtener SOLO el contenido del mensaje y el usuario
      const mensajes = mensajesFiltrados.map(m => ({ usuario: m.usuario, mensaje: m.mensaje }));
  
      return mensajes;
    }
    public static guardarMensaje5(mensaje: { usuario: string, mensaje: string }[], useSessionStorage: boolean = false): void {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages5', useSessionStorage) || [];
      
      // Agregar timestam a los mensajes
      const mensajesConTimestamp = mensaje.map(m => ({ ...m, timestamp: Date.now() }));
      mensajesGuardados.push(...mensajesConTimestamp);
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      storage.setItem('chatMessages5', JSON.stringify(mensajesFiltrados));
    }
  
    public static obtenerMensajes5(useSessionStorage: boolean = false): { usuario: string, mensaje: string }[] {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages5', useSessionStorage) || [];
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      // Obtener SOLO el contenido del mensaje y el usuario
      const mensajes = mensajesFiltrados.map(m => ({ usuario: m.usuario, mensaje: m.mensaje }));
  
      return mensajes;
    }

    public static guardarMensaje6(mensaje: { usuario: string, mensaje: string }[], useSessionStorage: boolean = false): void {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages6', useSessionStorage) || [];
      
      // Agregar timestam a los mensajes
      const mensajesConTimestamp = mensaje.map(m => ({ ...m, timestamp: Date.now() }));
      mensajesGuardados.push(...mensajesConTimestamp);
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      storage.setItem('chatMessages6', JSON.stringify(mensajesFiltrados));
    }
  
    public static obtenerMensajes6(useSessionStorage: boolean = false): { usuario: string, mensaje: string }[] {
      const storage = useSessionStorage ? sessionStorage : localStorage;
      const mensajesGuardados = this.getItem<{ usuario: string, mensaje: string, timestamp: number }[]>('chatMessages6', useSessionStorage) || [];
  
      // TIEMPO QUE DURAN LOS MENSAJES
      // const limiteTiempo = 1 * 60 * 1000; // 1 minuto en milisegundos
      const limiteTiempo = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
      const mensajesFiltrados = mensajesGuardados.filter(m => Date.now() - m.timestamp <= limiteTiempo);
  
      // Obtener SOLO el contenido del mensaje y el usuario
      const mensajes = mensajesFiltrados.map(m => ({ usuario: m.usuario, mensaje: m.mensaje }));
  
      return mensajes;
    }
  }