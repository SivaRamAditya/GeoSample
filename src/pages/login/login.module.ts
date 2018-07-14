import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { FBSigninComponent } from '../../app/fb-signin-component';
import { LoginPage } from './login';

@NgModule({
  declarations: [
    LoginPage,
    FBSigninComponent
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslateModule.forChild()
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule { }
