import React from "react";
import {Line} from "react-chartjs-2";
import $ from "axios";

export default class LineGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      datasets: [
        {
          label: 'Total Cases US',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: []
        }
      ]
    };
    this.chartReference = React.createRef();
  }

  async componentDidMount() {
    const currentState = this.state;
    const response = await $.get(
        "https://api.thevirustracker.com/free-api?countryTimeline=US"
      ).then(function(res) {
         let totalCases = [];
         for(let val in res.data.timelineitems[0]) {
             totalCases.push(res.data.timelineitems[0][val].total_cases);
         }
          return totalCases;
      }).catch(function(err) {
          console.log(err);
          return null;
      });
      currentState.datasets[0].data = response;
      currentState.labels = new Array(response.length);
      this.setState({ currentState });
  }

  render() {
    return <Line ref={this.chartReference} data={this.state} />;
  }
}
