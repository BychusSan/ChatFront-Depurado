

export interface IMessage {
user: string;
text: string;
avatar: string;
rol?: string;
room : string ;

file?: File | string; 
fecha?: Date;
id?: number;
receptor?: string;
}




  
export interface Mensaje {
    emisor: string;
    receptor: string;
    contenido: string;
  }

