import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { UserSearchComponent } from '../components/user-search/user-search.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UpdateComponentService } from '../services/update-component.service';
import { MatMenuModule } from '@angular/material/menu';
import { MenuComponent } from '../components/menu/menu.component';
import { AddObjectsComponent } from '../account-edit/house/add-objects/add-objects.component';
import { ChatHostComponent } from '../chat/user/chat-host/chat-host.component';
import { ChatUserComponent } from '../chat/user/chat-user/chat-user.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatHostHouseComponent } from '../chat/house/chat-host-house/chat-host-house.component';
import { ChatHouseComponent } from '../chat/house/chat-house/chat-house.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoaderComponent } from '../components/loader/loader.component';
import { SelectionHousingComponent } from '../components/house/selection-housing/selection-housing.component';
import { AddHouseComponent } from '../components/house/add-house/add-house.component';
import { DeleteHComponent } from '../components/house/delete-h/delete-h.component';
import { SharedRoutingModule } from './shared-routing.module';
@NgModule({
  declarations: [
    FooterComponent,
    UserSearchComponent,
    LoaderComponent,
    SelectionHousingComponent,
    AddHouseComponent,
    MenuComponent,
    AddObjectsComponent,
    ChatUserComponent,
    ChatHostComponent,
    ChatHouseComponent,
    ChatHostHouseComponent,
    DeleteHComponent,
  ],
  exports: [
    FooterComponent,
    UserSearchComponent,
    LoaderComponent,
    SelectionHousingComponent,
    AddHouseComponent,
    MenuComponent,
    AddObjectsComponent,
    ChatUserComponent,
    ChatHostComponent,
    ChatHouseComponent,
    ChatHostHouseComponent,
    DeleteHComponent,
  ],
  providers: [
    UpdateComponentService,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatDialogModule,
    FormsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
  ]
})
export class SharedModule { }
