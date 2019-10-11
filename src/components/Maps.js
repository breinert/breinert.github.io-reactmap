/*global google*/
import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, BicyclingLayer, Marker, InfoWindow } from "react-google-maps"


const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={12}
    defaultCenter={{ lat: 40.027587, lng: -83.0624 }}
    // move center of map to chosen location
    center={ props.center ? props.center[0] : { lat: 40.027586, lng: -83.0624 }}
  >
  {/* map the marker info to the map markers */}
  {props.showingVenues &&
  props.showingVenues.map((marker, idx) => {
    const venueInfo = props.venues.find(venue => venue.venue.id === marker.id);
      return (
        <Marker
        key={idx}
        position={{ lat: marker.lat, lng: marker.lng }}
        onClick={() => props.handleOnClick(marker)}
        // bounce marker when selected
        animation={marker.isOpen
          ? google.maps.Animation.BOUNCE
          : google.maps.Animation.null}
        >
        {/* if biking location are on map, handle click */}
          {marker.isOpen && props.click <= 1 && (
            <InfoWindow
            onCloseClick={() => props.handleCloseMarker(marker)}>
              <p>{props.showingVenues.name}</p>
            </InfoWindow>
          )}
          {/* if coffee shop location are on map, handle click */}
          {marker.isOpen && props.click > 1 && (
            <InfoWindow
            onCloseClick={() => props.handleCloseMarker(marker)}>
              <figure>
                <img src={`${venueInfo.bestPhoto.prefix}200x200${venueInfo.bestPhoto.suffix}`}
                alt={"Venue"}/>
                <figcaption>{venueInfo.name} {<br></br>}
                {venueInfo.location.address} {<br></br>}
                {venueInfo.hours.status}
                <a href={`${venueInfo.url}`} target="_blank" rel="noopener noreferrer">Link</a> </figcaption>
              </figure>
            </InfoWindow>
          )}
        </Marker>
      )}
    )}
    <BicyclingLayer autoUpdate />
  </GoogleMap>
))
class Map extends React.Component {
  render() {
    return (
      <MyMapComponent
        {...this.props}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDUZDt6xP79oqTXaAB6leSmMCYzZkc4Zdo"
        loadingElement={<div style={{ height: `100vh` }} />}
        containerElement={<div style={{ height: `100vh`, width: `75%` }} />}
        mapElement={<div style={{ height: `100vh` }} />}/>
    )
  }
}
export default Map
