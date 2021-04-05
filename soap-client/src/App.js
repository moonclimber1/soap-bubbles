
import './App.css';
import VolumeMeter from './components/VolumeMeter';
import React from 'react';

import MobileClient from './components/MobileClient';
import BubbleWorld from './components/BubbleWorld';

class App extends React.Component {

  constructor(props){
    super(props)
  }

  componentDidMount(){
    // if(window.location.pathname === '/world'){
    //   this.setState({mobileClient: false})
    // }else{
    //   this.setState({mobileClient: true})
    // }
  }
    
  render(){
    let client;
    if(window.location.pathname !== '/world'){
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
