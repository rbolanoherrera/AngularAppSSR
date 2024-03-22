import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Componente1 } from './components/componente1/componente1.component';
import { Componente2 } from './components/componente2/componente2.component';

const routes: Routes = [
  { path: 'modulo-web', component: Componente1 },
  { path: 'modulo-server', component: Componente2 },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
