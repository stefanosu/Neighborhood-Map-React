import React, {Component} from 'react';
import './App.css';
import Map from './Components/Map'
import Sidebar from "./Components/Sidebar";

class App extends Component {
    //Constructor 
    constructor(props) {
        super(props);
//Created an array of our fav locations, where we will set our markers to on map.
        this.state = {
            map: '',
            info: '',
            markers: [
                {
                    lat: 40.786810,
                    long: -73.975591,
                    name: 'Jacobs Pickle'
                },
                {
                    lat: 40.810009,
                    long: -73.958629,
                    name: 'Massawa',
                },
                {
                    lat: 40.747085,
                    long: -73.985038,
                    name: 'Baekjeong NYC'
                },
                {
                    lat: 40.8044,
                    long: -73.9662,
                    name: 'Koronet Pizza'
                },
                {
                    lat: 40.8025,
                    long: -73.9674,
                    name: 'Absolute Bagels'
                },
                {
                    lat: 40.8048,
                    long: -73.9555,
                    name: 'Harlem Tavern'
                },
                
            ],
            virtualMarkers: []
        };

      //Retain object instance when used in this function  
        this.initMap = this.initMap.bind(this);
        this.generateMarkers = this.generateMarkers.bind(this);
        this.openMarker = this.openMarker.bind(this);
    }

//Connect the initMap() function within this class to the global window object,
//so Google Maps can invoke it
    componentDidMount() {
        window.initMap = this.initMap;
// Asynchronously load the Google Maps script, passing in the callback reference
        createMapLink('https://maps.googleapis.com/maps/api/js?key=AIzaSyB1SGsAX5R2jiVfUOfy5cx4Ef5XDBsUOA0&callback=initMap');
    }
//init Map once the google map scripts is loaded 
    initMap() {
        let map;
        map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: {lat: 40.7413549, lng: -73.9980244}
        });
        //Create infoWindow
        const infowindow = new window.google.maps.InfoWindow({});

        this.setState({map: map, info: infowindow});
        this.generateMarkers(map);
    }
//Create markers to set on map from locations based from our markers[] array
    generateMarkers(map) {
        let self = this;
    // Looped through markers array 
        this.state.markers.forEach(marker => {
            const loc = {lat: marker.lat, lng: marker.long}

            let mark = new window.google.maps.Marker({
                position: loc,
                map: map,
                title: marker.name
            });

        //Made an eventListner function on click 
            mark.addListener('click', function () {
                self.openMarker(mark);
            });
            //Set marker clicked 
            let virtMarker = this.state.virtualMarkers;
            virtMarker.push(mark);

            this.setState({virtualMarkers: virtMarker});
        });
    }
//Retrive the location data from the foursquare api for the marker and display it in the infowindow
    openMarker(marker = '') {
        const clientId = "M3ZDMYBLEYPY3PNMHGJRF3U1CHK2N5CPVC3UQETFYCSAMBKA\n";
        const clientSecret = "BQCSV2H5KSOJ4EMRLHE2M2SFV310LZDJSOMUCZOB2AOJBMZQ\n";
        const url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";


        if (this.state.info.marker != marker) {
            this.state.info.marker = marker;
            this.state.info.open(this.state.map, marker);
            marker.setAnimation(window.google.maps.Animation.DROP);


            this.state.info.addListener('closeClick', function () {
                this.state.info.setMarker(null);
            });

            this.markerInfo(url);
        }
    }
//Examine the response from API request 
    markerInfo(url) {
        let self = this.state.info;
        let place;
        fetch(url)
            .then(function (resp) {
                if (resp.status !== 200) {
                    const err = "Can't load data.";
                    this.setState({info: err});
                }
        //Examine the response from API request    
                resp.json().then(function (data) {
                    var place = data.response.venues[0];
                    let phone = '';

                    if (place.contact.formattedPhone) {
                        phone = "<p><b>Phone:</b> "+ place.contact.formattedPhone +"</p>";
                    }

                    let twitter = '';

                    if (place.contact.twitter) {
                        twitter = "<p><b>Twitter:</b> "+ place.contact.twitter +"</p>";
                    }

                    var info =
                        "<div id='marker'>" +
                            "<h2>" + self.marker.title + "</h2>" +
                            phone +
                            twitter +
                            "<p><b>Address:</b> " + place.location.address + ", " + place.location.city + "</p>" +
                        "</div>";
                    self.setContent(info);
                });

                console.log(place);
            })
            .catch(function (err) {
                const error = "Can't load data.";
                self.setContent(error);
            });

    }

//Render function of app 
    render() {
        return (
            <div>
                <header>
                    <Sidebar
                        infoWindow={this.state.info}
                        openInfo={this.openMarker}
                        virtualMarker={this.state.virtualMarkers}
                    >

                    </Sidebar>
                    <h1 id="title">NYC Eats</h1>
                </header>
                <Map markers={this.state.markers}></Map>
            </div>
        );
    }
}

function createMapLink(url) {
    let tag = window.document.getElementsByTagName('script')[0];
    let script = window.document.createElement('script');

    script.src = url;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded. Please reload the page, and if that doesn't work reload the page. Otherwise reload page.");
    };

    tag.parentNode.insertBefore(script, tag);
}

export default App;