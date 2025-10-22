import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecordComponent } from './record/record.component';
import { MedicResourcesComponent } from './medic-resources/medic-resources.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ChatComponent } from './chat/chat.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: 'home',
    data: { breadcrumb: 'Inicio' },
    component: HomeComponent,
  },
  {
    path: 'chat',
    data: { breadcrumb: 'Chat' },
    component: ChatComponent,
  },
  {
    path: 'record',
    data: { breadcrumb: 'Historial' },
    component: RecordComponent,
  },
  {
    path: 'resources',
    data: { breadcrumb: 'Recursos' },
    component: MedicResourcesComponent,
  },
  {
    path: 'statistics',
    data: { breadcrumb: 'Estadísticas' },
    component: StatisticsComponent,
  },
  {
    path: 'profile',
    data: { breadcrumb: 'Perfil' },
    component: ProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
