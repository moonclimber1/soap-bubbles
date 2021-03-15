import logo from './logo.svg';
import './App.css';
import VolumeMeter from './VolumeMeter';

import bubble from './soap_bubble.jpg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={bubble} className="App-logo" alt="logo" />
        <VolumeMeter/>
      </header>
    </div>
  );
}
 
export default App;
