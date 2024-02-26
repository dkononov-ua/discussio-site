import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { serverPath, path_logo, serverPathPhotoFlat } from 'src/app/config/server-config';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})

export class UserComponent {
  statusMessage: string | undefined;
  path_logo = path_logo;

  constructor(
    private sharedService: SharedService,
  ) {
    this.sharedService.getStatusMessage().subscribe((message: string) => {
      this.statusMessage = message;
    });
  }
}
