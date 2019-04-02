import { Component } from '@angular/core';
import { MakerService } from '../maker.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private maker: MakerService) { }

  toggleToTreeJson() {
    this.maker.toggleToTreeJson();
  }

  toggleAddLevel() {
    this.maker.toggleAddLevel();
  }
}
