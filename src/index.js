import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

const GetInput = (props) => {
  return (
    <div>
      <h3>What did you just eat?</h3>
      <form onSubmit={props.handleSubmit}>
        <input value={props.input} onChange={props.handleChange} />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

const Total = (props) => {
  return (
    <div>
      {props.calories !== '' ? (
        props.calories > 300 ? (
          <h3>Wow that's {props.calories} calories</h3>
        ) : (
          <h3>Not so bad, only {props.calories} calories</h3>
        )
      ) : null}
    </div>
  );
};

const Exercise = (props) => {
  return (
    <div>
      <h3>To burn that you have to:</h3>
      <p>{`Run ${Math.round((props.calories / 100) * 10) / 10} miles`}</p>
      <p>Or</p>
      <p>{`Cycle for ${Math.round((props.calories / 600) * 10) / 10} hours`}</p>
      <p>Or</p>
      <p>{`Lift weights for ${Math.round((props.calories / 250) * 10) / 10} hours`}</p>
    </div>
  );
};

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      calories: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getTodayData = this.getTodayData.bind(this);
  }

  handleChange(event) {
    this.setState({
      inputValue: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getTodayData(this.state.inputValue);
  }

  getTodayData = async (food) => {
    try {
      const response = await fetch(
        `https://edamam-edamam-nutrition-analysis.p.rapidapi.com/api/nutrition-data?ingr=${food}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'edamam-edamam-nutrition-analysis.p.rapidapi.com',
            'x-rapidapi-key': '3e8f7f12d1msh89e2f6e4b63ed11p190647jsn11252f6994a3',
          },
        }
      );
      const fetchedData = await response.json();

      console.log(fetchedData);

      this.setState({
        calories: fetchedData.calories,
      });
    } catch (err) {}
  };

  render() {
    return (
      <div>
        <GetInput input={this.state.inputValue} handleChange={this.handleChange} handleSubmit={this.handleSubmit} />

        <Total calories={this.state.calories} />
        {this.state.calories !== '' ? <Exercise calories={this.state.calories} /> : null}
      </div>
    );
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(<Container />, domContainer);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
