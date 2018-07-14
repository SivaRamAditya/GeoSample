import { Component, ElementRef, AfterViewInit } from '@angular/core';
// import { AwsService } from '../app/aws.service';

declare const FB: any;

@Component({
    selector: 'fb-signin',
    template: '<button ion-button id="fb" value="fb" (click)="attachEventHandler()">Facebook</button>'
})
export class FBSigninComponent implements AfterViewInit {
    appId: string = '500380957049008';
    constructor(private elementRef: ElementRef) { }

    public fbInit(): any {
        FB.init({
            appId: this.appId,
            cookie: true,
            xfbml: true,
            version: 'v3.0'
        });
    }

    public attachEventHandler(): void {
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                FB.api('/me', {fields: 'email,first_name,last_name,name'}, function (result) {
                    alert('Successful login for: ' + result.name);
                });
            } else if (response.status === 'not_authorized') {
                FB.login(function (res) {
                    FB.api('/me', {fields: 'email,first_name,last_name,name'}, function (result) {
                        alert('Successful login for: ' + result.name);
                    });
                }, { scope: 'public_profile,email' });
            } else {
                FB.login(function (res) {
                    FB.api('/me', {fields: 'email,first_name,last_name,name'}, function (result) {
                        alert('Successful login for: ' + result.name);
                    });
                }, { scope: 'public_profile,email' });
            }
        });
    }

    ngAfterViewInit(): void {
        // console.log(window.FB);
        if (FB) {
            this.fbInit();
        }
    }

}
