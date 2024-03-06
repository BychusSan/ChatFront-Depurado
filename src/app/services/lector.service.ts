import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LectorService {
  lastReceivedMessage: string = '';
  isSpeechEnabled: boolean = false;
  speechEnabled: boolean = true;
  speechUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {}

  speak(): void {
    if (this.isSpeechEnabled && 'speechSynthesis' in window) {
      const mainContent =
        document.getElementById('descripcion-perfil')?.innerText;
      const speech = new SpeechSynthesisUtterance(mainContent);
      window.speechSynthesis.speak(speech);
    } else {
      alert(
        'Tu navegador no soporta la síntesis de voz o la función de voz está desactivada.'
      );
    }
  }

  speakperfil(): void {
    if (this.isSpeechEnabled && 'speechSynthesis' in window) {
      const mainContent =
        document.getElementById('descripcion-perfil')?.innerText;
      const speech = new SpeechSynthesisUtterance(mainContent);
      window.speechSynthesis.speak(speech);
    } else {
 
    }
  }

  speakTextos(): void {
    if (this.isSpeechEnabled && 'speechSynthesis' in window) {
      const mainContent =
        document.getElementById('descripcion-textos')?.innerText;
      const speech = new SpeechSynthesisUtterance(mainContent);
      window.speechSynthesis.speak(speech);
    } else {
    }
  }

  speakChatText(): void {
    if (this.isSpeechEnabled && 'speechSynthesis' in window) {
      const mainContent =
        document.getElementById('descripcion-chat')?.innerText;
      const speech = new SpeechSynthesisUtterance(mainContent);
      window.speechSynthesis.speak(speech);
    } else {
    }
  }

  speakChat(): void {
    const textToRead = this.lastReceivedMessage.trim();

    if (
      this.isSpeechEnabled &&
      'speechSynthesis' in window &&
      textToRead !== ''
    ) {
      const [username, messageText] = textToRead.split(':');

      const readWithInterval = (text: string) => {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
      };

      readWithInterval(username.trim());
      setTimeout(() => readWithInterval(messageText.trim()), 800);
    }
  }

  activaSpeak(): void {
    this.isSpeechEnabled = !this.isSpeechEnabled;
    if (this.isSpeechEnabled) {
      this.say('Lector activado');
    } else {
      this.say('Lector desactivado');
    }
  }

  // say(text: string): void {
  //   if (this.isSpeechEnabled !== false && 'speechSynthesis' in window) {
  //     const speech = new SpeechSynthesisUtterance(text);
  //     window.speechSynthesis.speak(speech);
  //   }
  // }
  
  say(text: string): void {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }
  }

  botonesSala(buttonText: string): void {
    if (this.isSpeechEnabled && this.speechEnabled) {
      this.speakBotones(buttonText);
    }
  }

  speakBotones(text: string): void {
    if (this.isSpeechEnabled && 'speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }
  }
}
