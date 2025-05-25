import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SaleComponent } from './components/sale/sale.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { adminAuthGuard } from './guards/admin-auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'books', component: BookListComponent },
  { path: 'books/:category', component: BookListComponent },
  { path: 'book/:id', component: BookDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'sale', component: SaleComponent },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [adminAuthGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
