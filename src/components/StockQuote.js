import React from 'react';
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

// Stock quotes as a component
class StockQuote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Retrieve symbol from parent component
      symbol: this.props.symbol,
      loading: true,
      rows: [],
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
      defaultColDef: {
        flex: 1,
        minWidth: 150,
        filter: false,
        suppressMenu: true,
        suppressMovable: true,
      },
    };
  }

  // Fetches the stock than parses the json and sets the state with json data
  async componentDidMount() {
    await fetch("http://localhost:3000/stocks/" + this.state.symbol, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
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
            json.timestamp = new Date(json.timestamp).toDateString();
            this.setState({
              loading: false,
              rows: [json],
            })
          }
        })
        .catch((error) => {
          console.log("Error getting stock quote: " + error)
          this.setState({
            loading: false,
            error: true,
          })
        });
  }

  render() {
    // Heading based on success of fetching stocks
    let heading;
    if (this.state.loading || this.state.error) {
      heading = <h1 className="h3 mb-3 font-weight-normal">Latest Stock Information</h1>
    } else {
      heading = (
          <React.Fragment>
            <h1 className="h3 mb-3 font-weight-normal">Latest Stock Information for {this.state.rows[0].name}</h1>
            <p>Industry: {this.state.rows[0].industry}</p>
          </React.Fragment>
      )

    }

    // Table (body) based on success of fetching stocks
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
      body = (
          <div className="ag-theme-alpine" style={ {height: '25%', width: '100%', 'margin-top': '20px'} }>
            {/*Custom ag-grid with black header*/}
        <AgGridReact
            columnDefs={this.state.columns}
            rowData={this.state.rows}
            defaultColDef={this.state.defaultColDef}
        >
        </AgGridReact>
      </div>)
    }
    return (
        <React.Fragment>
          {heading}
          {body}
        </React.Fragment>
    )
  }
}
export default StockQuote;