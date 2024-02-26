import { animations } from '../../interface/animation';
import { Component } from '@angular/core';
import { path_logo } from 'src/app/config/server-config';
@Component({
  selector: 'app-about-project',
  templateUrl: './about-project.component.html',
  styleUrls: ['./about-project.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.top,
    animations.top1,
  ],
})

export class AboutProjectComponent {
  path_logo = path_logo;
  currentStep: number = 0;
  statusMessage: string | undefined;
  changeStep(step: number): void { this.currentStep = step; }
}
