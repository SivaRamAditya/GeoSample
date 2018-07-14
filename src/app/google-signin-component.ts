import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { AwsService } from '../app/aws.service';
import { GooglePlus } from '@ionic-native/google-plus';
import { Callback } from '../app/aws.service';

// declare const gapi: any;

@Component({
  selector: 'app-google-signin',
  template: '<button ion-button success id="google" value="google" (click)="googleLogin()">Google</button>'
})
export class GoogleSigninComponent implements AfterViewInit {
  // private clientId:string = '1003662980890-ggv0j02j601cds9t1ebs72nu27odkb9q.apps.googleusercontent.com';
  // private clientSecret: string = 'DZ9GMeuBX50XrW1aTVPuT-Nd';
  clientId: string = this.awsService.googleId;
  private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ].join(' ');

  public auth2: any;

  public googleInit() {
    if (gapi) {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: this.clientId,
          cookiepolicy: 'single_host_origin',
          scope: this.scope
        });
        // this.attachSignin(this.element.nativeElement.firstChild);
      });
    }
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        const profile = googleUser.getBasicProfile();
        // console.log('Token || ' + googleUser.getAuthResponse().id_token);
        const authResponse = googleUser.getAuthResponse();
        // console.log(authResponse);
        console.log('Authenticated to Google!');
        alert('ID: ' + JSON.stringify(profile));
        //this.awsService.authenticateGoogle(authResponse, this.awsService.region, profile, this);
        //this.awsService.authenticateGoogle(authResponse, this.awsService.region, profile, this);
      }, function (error) {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

  googleLogin() {
    this.googlePlus.login({})
      .then(res =>
        alert
      ).catch(err =>
        console.error(err));
  }

  constructor(private element: ElementRef, public awsService: AwsService, private googlePlus: GooglePlus) {
    // console.log('ElementRef: ', this.element);
  }

  ngAfterViewInit() {
    this.googleInit();
   // this.googlePlus.getSigningCertificateFingerprint().then((res)=> console.log(res)).catch(error => alert(error));
  }

  googleCallback(creds: any, profile: any) {
    this.awsService.setGoogleCreds(creds);
    this.awsService.setGoogleProfile(profile);
  }
}
