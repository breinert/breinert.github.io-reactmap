import React, { Component } from 'react'
import Maps from './components/Maps'
import StartModal from './components/StartModal'
import Sidebar from './components/Sidebar'
import Reset from './components/Reset'
import axios from 'axios'
import escapeRegExp from 'escape-string-regexp'
import './App.css';
import initdata from './initdata.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      // showModal: true,
      // hover: false,
      // query: "",
      // click: 0,
      // venues: [],
      // showingVenues: [],
      // venueLocation: [],
      // center: [],
      // markers: []
    };
    this.handleCloseModal = this.handleClose.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleCloseMarker = this.handleCloseMarker.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
    this.clearQuery = this.clearQuery.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  // get initial data from json
  componentDidMount() {
    this.setState({ isLoading: true });

    fetch(initdata)
    .then(response => response.json())
    .then(data => this.setState({ data }))
  }

  // function to get coffee shopes at chosen location using clicked marker lat & lng
  getStores() {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "JDO1KAGDULQO3ETFJ4EDPEHN203BEDKSD1HB5UUKRDP2R3H2",
      client_secret: "UWMFNIMGT33V31ZGCVI1GICMRK43DSYBJSNBNJTKC2ECKIHH",
      query: "coffee",
      limit: "10",
      ll: this.state.venueLocation,
      v: "20181010"
    }

    // use axios to retrieve API data
    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
        const venues = response.data.response.groups[0].items;
        const markers = venues.map(venue => {
          return {
            lat: venue.venue.location.lat,
            lng: venue.venue.location.lng,
            name: venue.venue.name,
            id: venue.venue.id,
            isOpen: false,
            isVisible: true
          };
        });
        const showingVenues = markers;
        this.setState({ venues, markers, showingVenues });
    })
      .catch(error => {
        alert("Your information could not be obtained. Please restart the app to try again.");
      })
  }

  // close the start modal
  handleClose = () => {
    this.setState({showModal: false})
  }

  // set state and call function to find coffee shopes
  handleGetNewData = (marker) => {
    if (this.state.click === 0) {
      const venueLocation = [marker.lat, marker.lng];
      const center = { lat: marker.lat, lng: marker.lng };
      const markers = [];
      const names = [];
      const venues = [];
      const click = this.state.click + 1
      this.setState({
        venueLocation, center, markers, names, venues, click
      });
      this.getStores();
    } else {
      // set state and call function for details of one store
      this.setState({
        markers: Object.assign(this.state.markers, marker)
      });
      const venue = this.state.venues.find(venue => venue.venue.id === marker.id);
      const endPoint = `https://api.foursquare.com/v2/venues/${marker.id}?`
      const parameters = {
        client_id: "JDO1KAGDULQO3ETFJ4EDPEHN203BEDKSD1HB5UUKRDP2R3H2",
        client_secret: "UWMFNIMGT33V31ZGCVI1GICMRK43DSYBJSNBNJTKC2ECKIHH",
        v: "20181010"
      }

      // axios call for detail info
      axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        const myVenue = Object.assign(venue, response.data.response.venue );
        this.setState({ venues: Object.assign(this.state.venues, myVenue),
        click: this.state.click + 1 });
      })
      .catch(error => {
        alert("Your information could not be obtained. Please restart the app to try again.")
      })
    }
  }

  // check to see if marker is selected, if yes then get data
  handleOnClick = (marker) => {
    marker.isOpen ? this.handleGetNewData(marker) :
    this.handleCloseMarker();
    marker.isOpen = true;
    this.setState({
      showingVenues: Object.assign(this.state.showingVenues, marker)
    });
  }

  // if marker isOpen, close
  handleCloseMarker = () => {
    const showingVenues = this.state.showingVenues.map(marker => {
      marker.isOpen = false;
      return marker;
    })
    this.setState({
      showingVenues: Object.assign(this.state.showingVenues, showingVenues)
    });
    if (this.state.click === 2) this.setState({click: 1});
  }

  // mouseover for reset button
  handleMouseOver = () => {
    this.setState({ hover: !this.state.hover })
  }

  // update the query state to match the input
  updateQuery = (query) => {
    this.setState({
      query: query.trim()
    })
    this.updateSearchedVenues(query);
  }

  // make search lower-case and filter visible venues that match search
  updateSearchedVenues = (query) => {
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i')
      this.setState({
        showingVenues: Object.assign(this.state.showingVenues.filter((marker) => match.test(marker.name)))
      })
    } else {
      this.setState({
        showingVenues: this.state.markers
      })
    }
  }

  // reset the searchbox
  clearQuery = () => {
    this.setState({
      query: "",
      showingVenues: this.state.markers
    })
  }

  // set state to initial state
  handleReset = () => {
    this.setState()
  }

  render() {
    return (
      <div className="App">
        <Reset
        {...this.state}
        handleMouseOver = {this.handleMouseOver}
        handleReset = {this.handleReset}
        />
        <Sidebar
        {...this.state}
        handleOnClick = {this.handleOnClick}
        updateQuery = {this.updateQuery}
        clearQuery = {this.clearQuery}
        />
        <Maps
        {...this.state}
        handleOnClick = {this.handleOnClick}
        handleCloseMarker = {this.handleCloseMarker}
        />
        <StartModal
        {...this.state}
        handleCloseModal = {this.handleCloseModal}
        />
      </div>
    );
  }
}

export default App;
