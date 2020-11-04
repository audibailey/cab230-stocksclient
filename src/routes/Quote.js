import React from 'react';
import Fade from 'react-bootstrap/Fade';
import { withRouter } from 'react-router-dom';
import { AuthConsumer } from './../components/Auth';
import StockQuote from './../components/StockQuote';
import Stocks from './../routes/Stocks';
import StockAuthedQuote from './../components/StockAuthedQuote';

// Quote page as a component
class Quote extends React.Component {
  render() {
    let body;

    // If not redirected by /stocks, render as stocks page
    if (Object.keys(this.props.match.params).length === 0) {
      body = <Stocks />
    } else {
      /*Auth consumer to check logged in status*/
      body = (
          <AuthConsumer>
            {({ isLoggedIn, logout, token }) => {
              let loggedIn = isLoggedIn()
              // Determine the type of stock info to show if logged in or not
              if (!loggedIn) {
                return <StockQuote symbol={this.props.match.params.symbol}/>
              } else {
                return <StockAuthedQuote symbol={this.props.match.params.symbol} token={token()}/>
              }
            }}
          </AuthConsumer>
      )
    }
    // Animation for cleanliness
    return (
      <Fade mountOnEnter={true} appear={true} in={true}>
        <div className={'container d-flex h-100'}>
          <div className={'row align-self-center w-100'}>
            <div className="col-10 mx-auto Stocks-maxheight">
              {body}
            </div>
          </div>
        </div>
      </Fade>
    )
  }
}
export default withRouter(Quote);