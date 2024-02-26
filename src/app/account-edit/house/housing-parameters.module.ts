import { NgModule } from '@angular/core';
import { AboutComponent } from './about/about.component';
import { AddressComponent } from './address/address.component';
import { ParamComponent } from './param/param.component';
import { PhotoComponent } from './photo/photo.component';
import { HousingParametersComponent } from './housing-parameters.component';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HousingParametersRoutingModule } from './housing-parameters-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteHouseComponent } from '../../components/house/delete-house/delete-house.component';
import { AdditionalInfoComponent } from './additional-info/additional-info.component';
import { GestureService } from 'src/app/services/gesture.service';

@NgModule({
  declarations: [
    HousingParametersComponent,
    AboutComponent,
    AddressComponent,
    ParamComponent,
    PhotoComponent,
    DeleteHouseComponent,
    AdditionalInfoComponent,
  ],
  providers: [
    SelectedFlatService,
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureService },
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    RouterModule,
    HousingParametersRoutingModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
})
export class HousingParametersModule { }
