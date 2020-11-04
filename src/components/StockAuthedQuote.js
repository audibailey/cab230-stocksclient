import React from 'react';
import { Link } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import Plot from 'react-plotly.js';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import './StockQuote.css'

// Logged In stock quotes as a component
class StockAuthedQuote extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Revieve token and symbol from parent component
      token: this.props.token,
      stockSymbol: this.props.symbol,
      stockName: "",
      stockIndustry: "",
      loading: true,
      rows: [],
      dateMin: "",
      from: "1970-01-01".split("-").reverse().join("/"),
      fromValid: false,
      to: new Date().toISOString().slice(0,10).split("-").reverse().join("/"),
      dateMax: "",
      toValid: false,
      firstFetch: true,
      timeTook: 0,
      chartData: {},
      newStock: "",
      // Set ag-grid column information
      columns: [
        {
          headerName: "Date",
          field: "timestamp",
        },
        {
          headerName: "Opening Price",
          field: "open",
        },
        {
          headerName: "Highest Price",
          field: "high",
        },
        {
          headerName: "Lowest Price",
          field: "low",
        },
        {
          headerName: "Closing Price",
          field: "close",
        },
        {
          headerName: "Trade Volume",
          field: "volumes",
        }
      ],
      // Ag-grid column defaults
      defaultColDef: {
        flex: 1,
        minWidth: 150,
        filter: false,
        suppressMenu: true,
        suppressMovable: true,
      },
    };

    this.submit = this.submit.bind(this)
  }

  // Used to ensure the inputted dates are valid dates within range
  valid(date) {
    let re = /^\d{2}\/\d{2}\/\d{4}$/;

    if (date !== '' && date.match(re)) {
      let dateTest = new Date(date.split(/\//).reverse().join('/'))
      let dateMin = new Date(this.state.dateMin.split(/\//).reverse().join('/'))
      let dateMax = new Date(this.state.dateMax.split(/\//).reverse().join('/'))
      if (dateTest >= dateMin && dateTest <= dateMax) {
        return true
      }
      return false
    } else {
      return false;
    }
  }

  // Used to alter from field in state
  setFrom(from) {
    this.setState(({
      from: from,
      error: false
    }))
  };

  // Used to alter to field in state
  setTo(to) {
    this.setState(({
      to: to,
      error: false
    }))
  }

  // Used to clean the recieved json to be able to chart
  cleanJSON(json) {
    let cleanJSONData = {
      timestampdate: [],
      close: [],
      open: [],
      low: [],
      high: [],
    };

    let rawDate = []

    json.forEach(stockData => {
      rawDate.push(new Date(stockData.timestamp))
      cleanJSONData.timestampdate.push(new Date(stockData.timestamp).toLocaleDateString())
      cleanJSONData.low.push(stockData.low);
      cleanJSONData.high.push(stockData.high);
      cleanJSONData.open.push(stockData.open);
      cleanJSONData.close.push(stockData.close);
    })

    cleanJSONData.timestampdate.reverse()
    cleanJSONData.close.reverse()
    cleanJSONData.open.reverse()
    cleanJSONData.low.reverse()
    cleanJSONData.high.reverse()

    // Set the min and max dates
    if (this.state.firstFetch) {
      this.setState(({
        from: new Date(Math.min.apply(null,rawDate)).toISOString().slice(0,10).split("-").reverse().join("/"),
        to: new Date(Math.max.apply(null,rawDate)).toISOString().slice(0,10).split("-").reverse().join("/"),
        dateMin: new Date(Math.min.apply(null,rawDate)).toISOString().slice(0,10).split("-").reverse().join("/"),
        dateMax: new Date(Math.max.apply(null,rawDate)).toISOString().slice(0,10).split("-").reverse().join("/"),
        firstFetch: false
      }))
    }

    return cleanJSONData
  }

  // Fetches the stock with date intervals than parses the json and sets the state with json data
  async fetchStock(from, to) {
    let t0 = performance.now();
    await fetch('http://localhost:3000/stocks/authed/' + this.state.stockSymbol +
          '?from=' + from.split("/").reverse().join("-")+"T00:00:00.000Z" +
          '&to=' + to.split("/").reverse().join("-")+"T00:00:00.000Z", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.state.token,
          'Accept': 'application/json',
        },
      }).then(resp => {
          return resp.json()
        })
        .then(json => {
          if (json.error) {
            this.setState({
              loading: false,
              error: json.message
            })
          } else {
            // Ensure timestamp is a better format
            json.map(stockTime => (stockTime.timestamp = new Date(stockTime.timestamp).toDateString()))
            this.setState({
              loading: false,
              rows: json,
              chartData: this.cleanJSON(json),
              stockIndustry: json[0].industry,
              stockName: json[0].name,
              timeTook: performance.now()-t0,
            })
          }
        })
        .catch((error) => {
          console.log("Error getting stock Quote: " + error)
          this.setState({
            loading: false,
            error: true,
          })
        });
  }

  // On component mount fetch the stocks
  componentDidMount() {
    this.fetchStock(this.state.from,  this.state.to);
  }

  // When the user changes the date range to a valid date, fetch the stocks
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.from !== prevState.from || this.state.to !== prevState.to)  {
      this.fetchStock(this.state.from, this.state.to)
    }
  }

  submit() {
    this.setState({
      stockSymbol: this.state.newStock,
      stockName: "",
      stockIndustry: "",
      loading: true,
      rows: [],
      dateMin: "",
      from: "1970-01-01".split("-").reverse().join("/"),
      fromValid: false,
      to: new Date().toISOString().slice(0,10).split("-").reverse().join("/"),
      dateMax: "",
      toValid: false,
      firstFetch: true,
      timeTook: 0,
      chartData: {},
    })
  }

  render() {

    // Heading based on success of fetching stocks
    let heading;
    if (this.state.loading || this.state.error) {
      heading = <h1 className="h3 mb-3 font-weight-normal">Latest Stock Information</h1>
    } else {
      heading = (
        <React.Fragment>
          <h1 className="h3 mb-3 font-weight-normal">Latest Stock Information for {this.state.stockName} (Symbol: {this.state.stockSymbol})</h1>
          <p className="no-margins">Industry: {this.state.stockIndustry}</p>
        </React.Fragment>
      )
    }

    // Date selector based on success of fetching stocks
    let date;
    if (!this.state.loading && !this.state.error) {
      date = (
          <Form>
            <Form.Row>
              <Form.Group as={Col} md="4">
                <Form.Label column md="12">
                  From:
                </Form.Label>
                <Col md="10">
                  <Form.Control placeholder="DD/MM/YYYY" defaultValue={this.state.from} onChange={
                    e => {
                      // On change ensure the value is valid than update state for field validation and fetch information
                      if (this.valid(e.target.value)) {
                        this.setState({fromValid: false})
                        this.setFrom(e.target.value);
                      } else {
                        this.setState({fromValid: true})
                      }
                    }
                  } isInvalid={this.state.fromValid}/>
                  <Form.Control.Feedback type="invalid">
                    Invalid Date
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label column md="12">
                  To:
                </Form.Label>
                <Col md="10">
                <Form.Control placeholder="DD/MM/YYYY" defaultValue={this.state.to} onChange={
                  e => {
                    // On change ensure the value is valid thann update state for field validation and fetch information
                    if (this.valid(e.target.value)) {
                      this.setState({fromTo: false})
                      this.setTo(e.target.value);
                    } else {
                      this.setState({fromTo: true})
                    }
                  }
                } isInvalid={this.state.fromTo}/>
                <Form.Control.Feedback type="invalid">
                  Invalid Date
                </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label column md="12">
                  Change Stock:
                </Form.Label>
                <Row>
                  <Col md="8">
                    <Form.Control placeholder={this.state.stockSymbol} defaultValue={this.state.stockSymbol} onChange={
                      e => {
                        this.setState(({
                          newStock: e.target.value
                        }))
                      }
                    }/>
                  </Col>
                  <Col md="4">
                    <Link to={"/quote/"+this.state.newStock}>
                      <Button variant="primary" value="SUBMIT" onClick={this.submit}>
                        Change
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Form.Group>
            </Form.Row>
          </Form>
      )
    }

    // Graph and Table (body) based on success of fetching stocks
    let body;
    if (this.state.error) {
      // Error if fetch failed
      body = (<Alert variant="danger">
        <p>{this.state.error}. Failed to load stock information. Reload the page or go <Link to={"/"} >home</Link>.</p>
      </Alert>)
    } else if (this.state.loading && !this.state.error) {
      // During loading have loading displayed
      body = <p>Loading...</p>
    } else {
      // The Graph and Table
      body = (
        <div style={{height: '80%', width: '100%'}}>
          <div style={ {height: '70%', width: '100%'} } className={"text-center"}>
            {/*Graph, Plot.ly Candlestick responsive with correct data and bootstrap theme*/}
            <Plot
                data={[
                  {
                    x: this.state.chartData.timestampdate,

                    close: this.state.chartData.close,

                    decreasing: {line: {color: '#d9534f'}},

                    high: this.state.chartData.high,

                    increasing: {line: {color: '#5cb85c'}},

                    line: {color: '#0275d8'},

                    low: this.state.chartData.low,

                    open: this.state.chartData.open,

                    type: 'candlestick',
                    xaxis: 'x',
                    yaxis: 'y'
                  }
                ]}
                layout={{
                  margin: {
                    r: 10,
                    t: 25,
                    b: 50,
                    l: 60
                  },
                  showlegend: false,
                  xaxis: {
                    title: 'Date',
                  },
                  yaxis: {
                    title: 'Stock Price ($)'
                  },
                  autosize: true,
                }}
                useResizeHandler={true}
                style={{width: "100%", height: "100%"}}
            />
          </div>
          {/*Custom ag-grid with black header*/}
          <div className="ag-theme-alpine" style={ {height: '25%', width: '100%', 'margin-top': '20px'} }>
            <AgGridReact
                columnDefs={this.state.columns}
                rowData={this.state.rows}
                defaultColDef={this.state.defaultColDef}
            >
            </AgGridReact>
          </div>
          <p className="no-margins">Loaded {this.state.rows.length} results in {this.state.timeTook.toFixed(2)}ms!</p>
        </div>
      )
    }

    return (
        <React.Fragment>
          {heading}
          {date}
          {body}
        </React.Fragment>
    )
  }
}
export default StockAuthedQuote;