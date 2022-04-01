import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './components/shell/shell.component';
import { CategoriesFormComponent } from './pages/dashboard/categories/categories-form/categories-form.component';
import { CategoriesListComponent } from './pages/dashboard/categories/categories-list/categories-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersDetailsComponent } from './pages/dashboard/orders/orders-details/orders-details.component';
import { OrdersListComponent } from './pages/dashboard/orders/orders-list/orders-list.component';
import { ProductsFormComponent } from './pages/dashboard/products/products-form/products-form.component';
import { ProductsListComponent } from './pages/dashboard/products/products-list/products-list.component';
import { UsersFormComponent } from './pages/dashboard/users/users-form/users-form.component';
import { UsersListComponent } from './pages/dashboard/users/users-list/users-list.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '', component: ShellComponent,
    canActivate:[AuthGuardService],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'categorias', component: CategoriesListComponent },
      { path: 'categorias/form', component: CategoriesFormComponent },
      { path: 'categorias/form/:id', component: CategoriesFormComponent },
      { path: 'produtos', component: ProductsListComponent },
      { path: 'produtos/form', component: ProductsFormComponent },
      { path: 'produtos/form/:id', component: ProductsFormComponent },
      { path: 'usuarios', component: UsersListComponent },
      { path: 'usuarios/form', component: UsersFormComponent },
      { path: 'usuarios/form/:id', component: UsersFormComponent },
      { path: 'pedidos', component: OrdersListComponent },
      { path: 'pedidos/:id', component: OrdersDetailsComponent }
    ]
  },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
