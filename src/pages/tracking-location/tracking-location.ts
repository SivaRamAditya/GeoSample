import { Component, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';

declare var google;

@IonicPage()
@Component({
    selector: 'page-tracking-location',
    templateUrl: 'tracking-location.html'
})
export class TrackingLocationPage implements OnInit {
    geoOptions: GeolocationOptions;
    currentPosition: Geoposition;
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    trackingTime: any;
    constructor(private geoLocation: Geolocation, private zone: NgZone, private backgroundLocation: BackgroundGeolocation) { }

    ngOnInit(): void {
        this.getUserPosition();
    }

    getUserPosition() {
        const options = {
            enableHighAccuracy: false,
            frequency: 3000
        };
        this.geoLocation.getCurrentPosition(options).then((pos: Geoposition) => {

            const currentPos = pos;
            console.log(pos);
            // if(!this.trackingTime)
            //  this.updateWatchPosition();
            this.addMap(pos.coords.latitude,pos.coords.longitude);
        }, (err: PositionError) => {
            console.log("error : " + err.message);
        });
        this.geoLocation.watchPosition(options).subscribe((position: Geoposition) => {
            console.log(position);
            this.zone.run(() => {
                console.log(position.coords.latitude+' '+position.coords.longitude);
            });
        });
    }

    addMap(lat, long) {

        let latLng = new google.maps.LatLng(lat, long);

        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.addMarker();

    }

    addMarker() {
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter()
        });

        let content = "<p>This is your current position !</p>";
        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });
    }

    updateWatchPosition() {
       if(this.trackingTime){
           clearTimeout(this.trackingTime);
       }
       this.trackingTime = setTimeout(() => {
           this.getUserPosition();
       }, 1000);
    }
}