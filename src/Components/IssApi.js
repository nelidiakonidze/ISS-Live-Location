import React from 'react';
import NightMap from './NightMap.js';
import SpecsPanel from './SpecsPanel';
import PeopleAPI from './PeopleAPI.js';

class IssApi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iss_position: {},
      numberOfPeople: '',
      people: null,
      isLoaded: false
    };
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(props) {
    this.fetchSpaceStation()
  }

  componentDidMount() {
    this.fetchPeopleInSpace();
    this.fetchSpaceStation();
    this.interval = setInterval(() => this.fetchSpaceStation(), 10000);
  }

  fetchSpaceStation = () => {
    fetch('https://api.wheretheiss.at/v1/satellites/25544')
      .then(response => response.json())
      .then(data =>
        this.setState({
          iss_position: {
            latitude: data.latitude,
            longitude: data.longitude
          },
          isLoaded: true
        }))
      .catch(() => console.log('Error fetching satellite data.'));
  }

  fetchPeopleInSpace = () => {
    fetch('https://cors-anywhere.herokuapp.com/http://api.open-notify.org/astros.json')
      .then(response => response.json())
      .then(data => {
        this.setState({
          numberOfPeople: data.number,
          people: data.people,
          isLoaded: true
        })
      })
      .catch(() => {
        console.log('Error fetching astros data.');
        this.setState({
          numberOfPeople: 6,
          people: [{ craft: "ISS", name: "Oleg Kononenko" },
          { craft: "ISS", name: "David Saint-Jacques" },
          { craft: "ISS", name: "Anne McClain" },
          { craft: "ISS", name: "Alexey Ovchinin" },
          { craft: "ISS", name: "Nick Hague" },
          { craft: "ISS", name: "Christina Koch" }],
          isLoaded: true
        })
      });
  }


  render() {
    return (
      <div>
        <NightMap
          sateliteLocation={this.state.iss_position}
          userLocation={this.props.userLocation} />
        <SpecsPanel
          sateliteLocation={this.state.iss_position}
          numberOfPeople={this.state.numberOfPeople}
        />
        <PeopleAPI
          people={this.state.people}
        />
      </div>
    )
  }
}

export default IssApi;