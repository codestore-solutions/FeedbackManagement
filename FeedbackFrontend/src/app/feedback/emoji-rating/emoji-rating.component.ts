import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-emoji-rating',
  templateUrl: './emoji-rating.component.html',
  styleUrls: ['./emoji-rating.component.scss']
})
export class EmojiRatingComponent {
  @Input() receivedEmojiRating:number = 0;

}
