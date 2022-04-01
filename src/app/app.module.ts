import { NgModule } from '@angular/core';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import {DropdownModule} from 'primeng/dropdown';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShellComponent } from './components/shell/shell.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CategoriesListComponent } from './pages/dashboard/categories/categories-list/categories-list.component';
import { CategoriesService } from './services/categories.service';
import { CategoriesFormComponent } from './pages/dashboard/categories/categories-form/categories-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsListComponent } from './pages/dashboard/products/products-list/products-list.component';
import { ProductsFormComponent } from './pages/dashboard/products/products-form/products-form.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsersFormComponent } from './pages/dashboard/users/users-form/users-form.component';
import { UsersListComponent } from './pages/dashboard/users/users-list/users-list.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { OrdersDetailsComponent } from './pages/dashboard/orders/orders-details/orders-details.component';
import { OrdersListComponent } from './pages/dashboard/orders/orders-list/orders-list.component';
import { LoginComponent } from './pages/login/login.component'
import { JwtInterceptor } from './services/jwt.interceptor';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt); 

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CategoriesListComponent,
    ShellComponent,
    SidebarComponent,
    CategoriesFormComponent,
    ProductsListComponent,
    ProductsFormComponent,
    UsersFormComponent,
    UsersListComponent,
    OrdersDetailsComponent,
    OrdersListComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AngularEditorModule,
    NgxPaginationModule,
    NgxMaskModule.forRoot(maskConfig),
    DropdownModule
  ],
  providers: [CategoriesService, {
    provide:  DEFAULT_CURRENCY_CODE,
    useValue: 'BRL'
  }, {
    provide: LOCALE_ID, 
    useValue: "pt-BR"
  }, {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
