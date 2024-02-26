import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseComponent } from './house.component';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { AgreeDeleteComponent } from './agree-h/agree-delete/agree-delete.component';
import { AgreeMenuComponent } from './agree-h/agree-menu/agree-menu.component';
import { ActReceptionTransmissionComponent } from './agree-h/act-reception-transmission/act-reception-transmission.component';
import { ActViewComponent } from './agree-h/act-view/act-view.component';
import { AgreeDownloadComponent } from './agree-h/agree-download/agree-download.component';
import { HouseInfoComponent } from './house-info/house-info.component';
import { ResidentComponent } from './resident/resident.component';
import { AgreeSendComponent } from './agree-h/agree-send/agree-send.component';
import { AddObjectsComponent } from 'src/app/account-edit/house/add-objects/add-objects.component';

const routes: Routes = [
  {
    path: '',
    component: HouseComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'house-info', pathMatch: 'full' },
      { path: 'house-info', component: HouseInfoComponent, canActivate: [CanActivateGuard] },
      { path: 'filling', component: AddObjectsComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-delete', component: AgreeDeleteComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-menu', component: AgreeMenuComponent, canActivate: [CanActivateGuard] },
      { path: 'resident', component: ResidentComponent, canActivate: [CanActivateGuard] },
    ],
  },
  { path: 'act-create/:selectedFlatAgree', component: ActReceptionTransmissionComponent, canActivate: [CanActivateGuard] },
  { path: 'act-create', component: ActReceptionTransmissionComponent, canActivate: [CanActivateGuard] },
  { path: 'act-view/:selectedFlatAgree', component: ActViewComponent, canActivate: [CanActivateGuard] },
  { path: 'agree-download/:selectedFlatAgree', component: AgreeDownloadComponent, canActivate: [CanActivateGuard] },
  { path: 'agree-send/:selectedFlatAgree', component: AgreeSendComponent, canActivate: [CanActivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HouseRoutingModule { }
