import { Component, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import { IonicPage } from 'ionic-angular';
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
    geolocation: any;
    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('dest') destElement: ElementRef;
    map: any;
    marker: any;
    watchCounter: number = 0;
    autocomplete: any;
    directionsDisplay = new google.maps.DirectionsRenderer;
    origin: string;
    constructor(private geoLocation: Geolocation, private zone: NgZone, private backgroundLocation: BackgroundGeolocation) { }

    ngOnInit(): void {
        alert("Your current location is defaultly selected as starting point");
        this.autocomplete = new google.maps.places.Autocomplete(this.destElement.nativeElement);
        this.getUserPosition();
    }

    getUserPosition() {
        const options = {
            enableHighAccuracy: false,
            frequency: 5000
        };
        // this.geoLocation.getCurrentPosition(options).then((pos: Geoposition) => {
        //     console.log(pos);
        //     // if(!this.trackingTime)
        //     //  this.updateWatchPosition();
        //     this.zone.run(() => {
        //         this.getUserPosition();
        //         alert("Your Latitude is "+pos.coords.latitude);
        //     });
        //     this.addMap(pos.coords.latitude,pos.coords.longitude);
        // }, (err: PositionError) => {
        //     console.log("error : " + err.message);
        // });
        this.geoLocation.watchPosition(options).subscribe((position: Geoposition) => {
            if (this.currentPosition !== position && this.watchCounter == 0) {                
                this.geolocation = '';
                this.currentPosition = position;
                this.addMap(position.coords.latitude, position.coords.longitude);
                this.watchCounter = 1;
                this.marker = new google.maps.Marker({
                    map: this.map,
                   // animation: google.maps.Animation.DROP,
                    position: this.map.getCenter()
                });
            } else {
                //this.addMap(position.coords.latitude, position.coords.longitude);
                let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                this.addMarker(latLng);
                this.map.setCenter(latLng);
            }
        }, (err: PositionError) => {
            console.log("error : " + err.message);
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
        this.updateGeocode(latLng);
        //this.addMarker();

    }

    addMarker(latLng: any) {
        this.marker.setPosition(latLng);
        let content = "<p>This is your current position !</p>";
        let infoWindow = new google.maps.InfoWindow({
            content: content
        });
        google.maps.event.addListener(this.marker, 'click', () => {
            infoWindow.open(this.map, this.marker);
        });
    }

    updateGeocode(latLng) {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'location': latLng }, (results, status) => {
            if (status === 'OK') {
                console.log(results);
                if (results && results.length > 0) {
                    this.origin = results[0].formatted_address;
                    //this.map.setCenter(results[0].geometry.location);
                    //this.addMarker();
                }
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    getDirections() {
        const dest = this.autocomplete.getPlace().formatted_address;
        const directionsService = new google.maps.DirectionsService;

        this.directionsDisplay.setMap(this.map);

        directionsService.route({
            origin: this.origin,
            destination: dest,
            travelMode: 'DRIVING'
        }, (response, status) => {
            if (status === 'OK') {
                this.directionsDisplay.setDirections(response);
            } else {
                alert('Directions request failed due to ' + status);
            }
        });
    }
    // updateWatchPosition() {
    //    if(this.trackingTime){
    //        clearTimeout(this.trackingTime);
    //    }
    //    this.trackingTime = setTimeout(() => {
    //        this.getUserPosition();
    //    }, 1000);
    // }
}