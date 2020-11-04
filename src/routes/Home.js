import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Fade from 'react-bootstrap/Fade';
import './Home.css';

// Home page as a component
class Home extends React.Component {
  render() {
    return (
        // Animation for cleanliness
        <Fade mountOnEnter={true} appear={true} in={true}>
          <div className={'container d-flex h-100'}>
            <div className={'row align-self-center w-100'}>
              <div className="col-6 mx-auto">
                {/* Bootstrap Jumbotron */}
                <Jumbotron>
                  <h1>Stock Analyst</h1>

                  <p>
                    Welcome to the Stock Analyst portal. Click on Stocks to see the available companies and find out
                    their latest price. Register or Login to see the most recent 100 days of an avaliable companies price.
                  </p>

                  <p>
                    {/* Credit Jumbotron Background */}
                    Photo by <a href={"https://unsplash.com/@markusspiske"}>Markus Spiske</a> on Unsplash.
                  </p>
                </Jumbotron>
              </div>
            </div>
          </div>
        </Fade>
    )
  }
}
export default Home;