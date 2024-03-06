import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { IMessage } from 'src/app/interfaces/message.interface';
import { FileDataService } from 'src/app/services/fileData.Service';
import { ChatComponent } from '../PruebaChat/chat.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent {
  file!: File ;
  message = "";
  @Output() sendMessageEvent = new EventEmitter<Omit <IMessage, 'user' | 'avatar' | 'room'>>();

constructor( 
  private fileDataService: FileDataService,
  private chatComponent: ChatComponent
  ) { }



  sendMessage() {
    if (this.message.trim() == "" && !this.file) { return; }
    this.sendMessageEvent.emit({ text: this.message, file: this.file });
    
    this.message = ""
  }

  handleFileInput(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    if (fileList && fileList.length > 0) {
      this.file = fileList[0];
    }
  }

  onFileSelected(event: any): void {
   
    this.chatComponent.onFileSelected(event);
    console.log(`PRUEBA ENVIAR:`, event)
  }


  pulsadoEnterInputAdjuntarArchivo() {
    document.getElementById('file')!.click();
  }



  
}