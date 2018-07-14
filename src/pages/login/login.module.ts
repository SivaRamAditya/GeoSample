import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { FBSigninComponent } from '../../app/fb-signin-component';
import { LoginPage } from './login';
import { GoogleSigninComponent } from '../../app/google-signin-component';

@NgModule({
  declarations: [
    LoginPage,
    FBSigninComponent,
    GoogleSigninComponent
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
