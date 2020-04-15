import React from "react";
import Line from "react-chartjs-2";
import $ from "axios";

export default class LineGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        totalCases: []
    };
    this.chartReference = React.createRef();
  }

  async componentDidMount() {
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
      this.setState({ totalCases: response });
  }

  render() {
    return <Line ref={this.chartReference} data={this.state} />;
  }
}
