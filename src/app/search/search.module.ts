import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchComponent } from './search/search.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { FilterService } from './filter.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { FilterUserService } from './filter-user.service';
import { SearchTenantComponent } from './search-tenant/search-tenant.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProfileComponent } from './search-tenant/profile/profile.component';
import { SearchHousingComponent } from './search-housing/search-housing.component';
import { HouseComponent } from './search-housing/house/house.component';
import { GestureService } from '../services/gesture.service';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  declarations: [
    SearchComponent,
    SearchTenantComponent,
    ProfileComponent,
    SearchHousingComponent,
    HouseComponent,
  ],
  providers: [
    FilterService,
    FilterUserService,
    { provide: MatPaginatorIntl },
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureService },
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    DragDropModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    RouterModule,
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    MatSliderModule,
    SharedModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatRadioModule,
    MatCheckboxModule,
    MatMenuModule,
  ]
})
export class SearchModule { }
