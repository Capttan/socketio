import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'chat/:groupName/:name', component: ChatComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
