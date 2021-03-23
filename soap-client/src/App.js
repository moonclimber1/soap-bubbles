
import './App.css';
import VolumeMeter from './components/VolumeMeter';
import React from 'react';

import bubble from './assets/soap_bubble.jpg';
import MobileClient from './components/MobileClient';
import BubbleWorld from './components/BubbleWorld';

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      mobileClient: true
    }
  }

  componentDidMount(){
    if(window.location.pathname === '/world'){
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
      </div>
    );
  }
}
 
export default App;
