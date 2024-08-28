import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from "./components/base/base.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/base',
    pathMatch: 'full'
  },
  {
    path: 'base',
    component: BaseComponent,
    title: 'Клиенты',
  },
  {
    path: '**',
    redirectTo: '/base',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
