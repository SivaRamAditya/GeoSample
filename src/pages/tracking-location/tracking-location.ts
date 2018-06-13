import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { filter } from 'rxjs/operators';

declare var google;

@IonicPage()
@Component({
    selector: 'page-tracking-location',
    templateUrl: 'tracking-location.html'
})
export class TrackingLocationPage implements OnInit {
    currentMapTrack: any;
    geoOptions: GeolocationOptions;
    currentPosition: Geoposition;
    geolocation: any;
    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('dest') destElement: ElementRef;
    map: any;
    trackedRoute = [];
    marker: any;
    watchCounter: number = 0;
    autocomplete: any;
    directionsDisplay = new google.maps.DirectionsRenderer;
    origin: string;
    constructor(private geoLocation: Geolocation, private platform: Platform, private diagnostic: Diagnostic, private backgroundLocation: BackgroundGeolocation) { }

    ngOnInit(): void {
        if (this.platform.navigatorPlatform() === "Win32") {
            alert("Your current location is defaultly selected as starting point");
            this.autocomplete = new google.maps.places.Autocomplete(this.destElement.nativeElement);
            this.getUserPosition();
        } else {
            this.platform.ready().then(() => {
                this.diagnostic.isLocationEnabled().then((isAvailable) => {
                    alert("Your current location is defaultly selected as starting point");
                    this.autocomplete = new google.maps.places.Autocomplete(this.destElement.nativeElement);
                    this.getUserPosition();
                }).catch((error) => {
                    alert(JSON.stringify(error));
                    alert('Please enable the location details');
                });
            }).catch((error) => {
                console.log(error);
            });
            this.autocomplete = new google.maps.places.Autocomplete(this.destElement.nativeElement);
            this.getUserPosition();
        }
    }

    getUserPosition() {
        let mapOptions = {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.geoLocation.getCurrentPosition().then((position: Geoposition) => {
            console.log(position);
            const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            this.map.setCenter(latLng);
            this.trackedRoute.push({ lat: +position.coords.latitude, lng: +position.coords.longitude });
            this.currentPosition = position;
            this.updateGeocode(latLng);
        }, (err: PositionError) => {
            console.log("error : " + err.message);
        });

    }

    startTracking() {

        const options = {
            enableHighAccuracy: false,
            frequency: 3000
        };

        this.trackedRoute = [];
        this.geoLocation.watchPosition(options).pipe(
            filter((p) => p.coords !== undefined) //Filter Out Errors
        ).subscribe((position: Geoposition) => {
            if (this.currentPosition.coords.latitude !== position.coords.latitude && this.currentPosition.coords.longitude !== position.coords.longitude) { //&& this.watchCounter == 0) {
                this.currentPosition = position;
                this.filterDuplicates(position.coords.latitude, position.coords.longitude);
                this.addMarker(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                this.watchCounter = 1;
            } else {
                // if (this.currentPosition.coords.latitude !== position.coords.latitude && this.currentPosition.coords.longitude !== position.coords.longitude) {
                //     let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                //     this.updateGeocode(latLng);
                //     this.map.setCenter(latLng);
                // }
            }
        }, (err: PositionError) => {
            console.log("error : " + err.message);
        });
    }

    addMarker(latLng: any) {
        if (!this.marker) {
            this.marker = new google.maps.Marker({
                map: this.map,
                // animation: google.maps.Animation.DROP,
                position: this.map.getCenter()
            });
            let content = "<p>This is your current position !</p>";
            let infoWindow = new google.maps.InfoWindow({
                content: content
            });
            google.maps.event.addListener(this.marker, 'click', () => {
                infoWindow.open(this.map, this.marker);
            });
        } else {
            this.marker.setPosition(latLng);
        }

    }

    redrawPath(path) {
        if (this.currentMapTrack) {
            this.currentMapTrack.setMap(null);
        }

        if (path.length > 1) {
            this.currentMapTrack = new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: '#ff00ff',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });
            this.currentMapTrack.setMap(this.map);
        }
    }

    updateGeocode(latLng) {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'location': latLng }, (results, status) => {
            if (status === 'OK') {
                console.log(results);
                if (results && results.length > 0) {
                    this.origin = results[0].formatted_address;
                    if (this.autocomplete.getPlace() && this.autocomplete.getPlace().formatted_address) {
                        this.getDirections();
                    }
                }
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    filterDuplicates(lat, lng) {
        for (let index = 0; index < this.trackedRoute.length; index++) {
            if (this.trackedRoute[index].lat !== lat && this.trackedRoute[index].lng !== lng) {
                this.trackedRoute.push({ lat: +lat, lng: +lng });
                break;
            }
        }
    }
    getDirections() {
        const dest = this.autocomplete.getPlace() && this.autocomplete.getPlace().formatted_address ?
            this.autocomplete.getPlace().formatted_address : undefined;
        if (dest) {
            const directionsService = new google.maps.DirectionsService;
            const location = this.autocomplete.getPlace().geometry.location;
            this.filterDuplicates(location.lat(), location.lng());

            if (this.trackedRoute.length >= 2) {
                // this.redrawPath(this.trackedRoute);
                //this.addMarker(new google.maps.LatLng(location.lat(), location.lng()));
            }

            this.directionsDisplay.setMap(this.map);

            directionsService.route({
                origin: this.origin,
                destination: dest,
                travelMode: 'DRIVING'
            }, (response, status) => {
                if (status === 'OK') {
                    this.directionsDisplay.setDirections(response);
                    this.startTracking();
                } else {
                    alert('Directions request failed due to ' + status);
                }
            });
        } else {
            alert('Enter destination location');
        }

    }
}
