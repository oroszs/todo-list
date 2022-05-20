import './index.css';
import Manager from './Components/Manager.js';
import DateConvert from './Utils/DateConvert.js';
import React from 'react';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date(),
    }
  }

  componentDidMount() {
    setInterval(() => {
      let time = new Date();
      this.setState({
        time: time,
      });
    }, 500);
  }

  render() {
    const CONVERT = new DateConvert();
    let time = this.state.time;

      return (
        <div id='main'>
          <h1 id='main-title'>To-Do List</h1>
          <Manager time={time}/>
          <div id='time-div'>
            <h1 className='time-h1'>{CONVERT.day(time.getDay())}</h1>
            <h1 className='time-h1'>{CONVERT.month(time.getMonth())} {time.getDate()}</h1>
            <h1 className='time-h1'>{CONVERT.hour(time.getHours())}:{CONVERT.minute(time.getMinutes())} {time.getHours() < 12 ? 'AM' : 'PM'}</h1>
          </div>
        </div>
      );
  }

}

export default App;
