import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from './home-page/home-page.component';
import {LandingPageComponent} from './landing-page/landing-page.component';


const routes: Routes = [
  {path: 'data', component: HomePageComponent},
  {path: '', component: LandingPageComponent}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
