import React from 'react';
import Fade from 'react-bootstrap/Fade';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import StockTable from './../components/StockTable';
import "./Stocks.css"

// Stocks route as a component
class Stocks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      rows: [],
      timeTook: 0,
      columns: [
        {
          // Text filter thats sortable for symbol and custom render to include a link
          headerName: "Symbol",
          field: "symbol",
          filter: 'agTextColumnFilter',
          sortable: true,
          floatingFilterComponentParams: { suppressFilterButton: true },
          cellRenderer: function(params) {
            if (!params.node.group) {
              return '<a href="quote/' + params.value + '">' + params.value + '</a>';
            } else {
              return null;
            }},
        },
        {
          // Text filter thats sortable for stock name
          headerName: "Name",
          field: "name",
          filter: 'agTextColumnFilter',
          sortable: true,
          floatingFilterComponentParams: { suppressFilterButton: true },
        },
        {
          // Multi select filter thats sortable for industry
          headerName: "Industry",
          field: "industry",
          filter: 'agSetColumnFilter',
          sortable: true,
        },
      ],
      defaultColDef: {
        flex: 1,
        suppressMenu: true,
        suppressMovable: true,
      },
    };
  }

  // Used to get list of stocks and parse the json
  async componentDidMount() {
    let t0 = performance.now();
    await fetch('http://localhost:3000/stocks/symbols',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
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
            this.setState({
              loading: false,
              rows: json,
              timeTook: performance.now()-t0,
            })
          }
        })
        .catch((error) => {
            console.log("Error fetching stocks: ", error)
            this.setState({
              loading: false,
              error: true,
            })}
        );
  }

  render() {
    return (
        <Fade mountOnEnter={true} appear={true} in={true}>
          <div className={'container d-flex h-100'}>
            <div className={'row align-self-center w-100'}>
              <div className="col-10 mx-auto Stocks-maxheight">
                <h1 className="h3 mb-3 font-weight-normal">Stocks</h1>
                { /* Display an error if there is one */
                  this.state.error &&
                <Alert variant="danger">
                  <p>{this.state.error}. Failed to load stock list. Reload the page or go <Link to={"/"} >home</Link>.</p>
                </Alert>
                }
                { /* Show loading when loading */ this.state.loading && !this.state.error && <p>Loading...</p>}
                {
                  // Display the stock table
                  !this.state.error && !this.state.loading && <StockTable
                      rows={this.state.rows}
                      columns={this.state.columns}
                      defaultColDef={this.state.defaultColDef}
                      timeTook={this.state.timeTook}
                      />
                }
              </div>
            </div>
          </div>
        </Fade>
    )
  }
}
export default Stocks;