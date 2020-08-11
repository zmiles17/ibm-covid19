import React from "react";
import { Line } from "react-chartjs-2";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Axios from 'axios';

let totalTests = 0,
  positiveCases = 0,
  negativeCases = 0;

const states = [
  "AL",
  "AK",
  "AS",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FM",
  "FL",
  "GA",
  "GU",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MH",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "MP",
  "OH",
  "OK",
  "OR",
  "PW",
  "PA",
  "PR",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VI",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

let state = "GA";

const json = Axios.get("https://covidtracking.com/api/v1/states/daily.json").then(res => res.data);

// eslint-disable-next-line
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

// eslint-disable-next-line
Date.prototype.subtractDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
};

export default class LineGraph extends React.Component {
  constructor(props) {
    super(props);
    this.chartReference = React.createRef();
  }

  state = {
    labels: [],
    datasets: [
      {
        label: "Total",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#4574ad",
        borderColor: "#4574ad",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#4574ad",
        pointBackgroundColor: "#4574ad",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#4574ad",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
      },
      {
        label: "Positive",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#d89479",
        borderColor: "#d89479",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#d89479",
        pointBackgroundColor: "#d89479",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#d89479",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
      },
      {
        label: "Negative",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#9cbf9a",
        borderColor: "#9cbf9a",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#9cbf9a",
        pointBackgroundColor: "#9cbf9a",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#9cbf9a",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
      },
    ],
    startDate: new Date("2020-03-04T00:00:00-0500"),
    endDate: new Date().subtractDays(1),
  };

  componentDidMount() {
    this.filterData();
  }

  async filterData() {
    const currentState = Object.assign(this.state);
    const currentStart = moment(this.state.startDate).format("YYYYMMDD");
    const currentEnd = moment(this.state.endDate).format("YYYYMMDD");
    const response = await json
      .then((data) => {
        return data
          .filter((obj) => obj.state === state)
          .filter((obj) => obj.date >= currentStart && obj.date <= currentEnd)
          .reduce(
            (arr, next) => {
              arr[0].push(next.totalTestResults);
              arr[1].push(next.positive);
              arr[2].push(next.negative);
              arr[3].push(
                next.date
                  .toString()
                  .replace(/(\d{4})(\d{2})(\d{2})/g, "$2-$3-$1")
              );
              return arr;
            },
            [[], [], [], []]
          );
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
      
      totalTests = this.calculateTotals(response[0]);
      positiveCases = this.calculateTotals(response[1]);
      negativeCases = this.calculateTotals(response[2]);
  
      response[0].reverse(); // total
      response[1].reverse(); // positive
      response[2].reverse(); // negative
      response[3].reverse(); // dates
  
      currentState.datasets[0].data = response[0];
      currentState.datasets[1].data = response[1];
      currentState.datasets[2].data = response[2];
      currentState.labels = response[3];
      this.setState({ currentState });
  }

  calculateTotals(numbers) {
    return typeof numbers[numbers.length - 1] === "number"
      ? numbers[0] - numbers[numbers.length - 1]
      : numbers[0];
  }

  chooseState = (e) => {
    state = e.target.innerHTML;
    this.filterData();
  };

  selectStartDate = (selectedDate) => {
    this.setState(
      {
        startDate: selectedDate,
      },
      () => this.filterData()
    );
  };

  selectEndDate = (selectedDate) => {
    this.setState(
      {
        endDate: selectedDate,
      },
      () => this.filterData()
    );
  };

  render() {
    return (
      <Container fluid className="bottom-padded">
        <Row className="justify-content-end">
          <Col className="col-3">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="state-selector-btn">
                {state}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {states.map((state, i) => (
                  <Dropdown.Item onClick={this.chooseState} key={i}>
                    {state}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col className="col-8">
            <Row className="justify-content-start">
              <Col className="col-3">
                <p className="no-emphasis">Start Date:</p>
                <DatePicker
                  selected={this.state.startDate}
                  minDate={new Date("2020-03-04T00:00:00-0500")}
                  maxDate={this.state.endDate.subtractDays(1)}
                  onChange={this.selectStartDate}
                />
              </Col>
              <Col className="col-3">
                <p className="no-emphasis">End Date:</p>
                <DatePicker
                  selected={this.state.endDate}
                  minDate={this.state.startDate.addDays(1)}
                  maxDate={new Date().subtractDays(1)}
                  onChange={this.selectEndDate}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col className="col-7">
            <Line
              ref={this.chartReference}
              data={this.state}
              width={50}
              height={25}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </Col>
          <Col className="col-3">
            <Row className="justify-content-center">Positive Cases</Row>
            <Row>
              <p className="statementText covidPositive justify-content-center">
                {positiveCases}
              </p>
            </Row>
            <br />
            <Row className="justify-content-center">Negative Cases</Row>
            <Row>
              <p className="statementText covidNegative justify-content-center">
                {negativeCases}
              </p>
            </Row>
            <br />
            <Row className="justify-content-center">Total Tests</Row>
            <Row>
              <p className="statementText covidNeutral justify-content-center">
                {totalTests}
              </p>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}
