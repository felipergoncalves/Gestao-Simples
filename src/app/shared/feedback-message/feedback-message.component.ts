import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feedback-message',
  standalone: true,
  imports: [NgClass],
  templateUrl: './feedback-message.component.html',
  styleUrls: ['./feedback-message.component.scss'],
})
export class FeedbackMessageComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
}
