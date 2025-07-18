import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../api/auth.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  userMessage: string = '';
  chatHistory: { sender: string, text: string }[] = [];
  showChat: boolean = false;

  @ViewChild('chatHistoryDiv') private chatHistoryDiv!: ElementRef;

  constructor(private authService: AuthService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.chatHistoryDiv) {
      try {
        this.chatHistoryDiv.nativeElement.scrollTop = this.chatHistoryDiv.nativeElement.scrollHeight;
      } catch (err) {}
    }
  }

  toggleChat() {
    this.showChat = !this.showChat;
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.chatHistory.push({ sender: 'user', text: this.userMessage });

    this.authService.chatWithBot(
      this.userMessage,
      this.chatHistory.filter(m => m.sender === 'user').map(m => m.text)
    ).subscribe(
      res => {
        this.chatHistory.push({ sender: 'bot', text: res.response });
      },
      err => {
        this.chatHistory.push({ sender: 'bot', text: 'Có lỗi xảy ra, vui lòng thử lại.' });
      }
    );

    this.userMessage = '';
  }
}
