import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

// Stock list as a component
class StockTable extends React.Component {
  render() {
    return (
      <div className="ag-theme-alpine" style={ {height: '78.5%', width: '100%'}  }>
        {/*Custom ag-grid with black header and lots and lots of filtering/sorting options*/}
        <AgGridReact
            columnDefs={this.props.columns}
            rowData={this.props.rows}
            floatingFilter={true}
            defaultColDef={this.props.defaultColDef}
        >
        </AgGridReact>
        <p>Loaded {this.props.rows.length} results in {this.props.timeTook.toFixed(2)}ms!</p>
      </div>
    )
  }
}

export default StockTable;