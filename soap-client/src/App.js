import logo from './logo.svg';
import './App.css';
import VolumeMeter from './VolumeMeter';
import React from 'react';

import bubble from './soap_bubble.jpg';
import MobileClient from './MobileClient';
import BubbleWorld from './BubbleWorld';

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      mobileClient: true
    }
  }

  componentDidMount(){
    if(window.location.pathname == '/world'){
      this.setState({mobileClient: false})
    }else{
      this.setState({mobileClient: true})
    }
  }
    
  render(){
    let client;
    if(this.state.mobileClient){
      client = <MobileClient/>;
    }else{
      client = <BubbleWorld/>;
    }
    return (
      <div className="App">
        {client}
        <header className="App-header">
          <img src={bubble} className="App-logo" alt="logo" />
          <VolumeMeter/>
        </header>
      </div>
    );
  }
}
 
export default App;
