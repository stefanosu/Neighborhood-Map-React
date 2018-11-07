import React, {Component} from 'react';

class Sidebar extends Component {

    constructor() {
        super();

        this.state = {
            info: '',
            markers: [],
            query: ''
        };
    }

    componentDidMount() {
        this.setState({markers: this.props.virtualMarker});
    }

    open = () => {
        const sideBar = document.querySelector('.sideBar');

        sideBar.style.display === 'none' ? sideBar.style.display = 'block' : sideBar.style.display = 'none';
    }

    search = (event) => {
        const query = event.target.value.toLowerCase();
        const markers = this.props.virtualMarker;
        const newMarkers = [];

        markers.forEach(function (marker) {
            if (marker.title.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                marker.setVisible(true);
                newMarkers.push(marker);
            } else {
                marker.setVisible(false);
            }
        });

        this.setState({markers: newMarkers});
    }


    openMarker(marker) {
        console.log(marker);
        this.props.openInfo(marker);
    }

    render() {

        return (
            <div>
                <div className="veggieburgers" onClick={this.open}>
                    <div className="veggieline"></div>
                    <div className="veggieline"></div>
                    <div className="veggieline"></div>
                </div>
                <div className="sideBar">
                    <div className="form" role="form">
                        <input type="text"
                               aria-labelledby="filter" placeholder="Search..."
                               className="input" role="search"
                               onChange={this.search}/>
                    </div>
                    <ul>
                        {this.state.markers && this.state.markers.length && this.state.markers.map((marker, i) =>
                            <li key={i}>
                                <a href="#" onKeyPress={this.props.openInfo.bind(this, marker)}
                                   onClick={this.props.openInfo.bind(this, marker)}
                                tabIndex="0" role="button">{marker.title}</a>
                            </li>
                        )}

                    </ul>
                </div>
            </div>
        );
    }
}

export default Sidebar;