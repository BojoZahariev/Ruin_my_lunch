import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const GetInput = (props) => {
  return (
    <div className='formDiv'>
      <h3>What did you eat?</h3>
      <form onSubmit={props.handleSubmit}>
        <input value={props.input} onChange={props.handleChange} />
        <button type='submit'>Ruin it</button>
        <p>E.g: 1 apple, chicken, rice and chicken</p>
      </form>
    </div>
  );
};

const Total = (props) => {
  return <h3>{props.text}</h3>;
};

const Exercises = (props) => {
  return <p className='slide'>{props.text}</p>;
};

const Exercise = (props) => {
  const timeConverter = (n) => {
    console.log(n);
    var num = n;
    var hours = num / 60;
    var rHours = Math.floor(hours);
    var minutes = (hours - rHours) * 60;
    var rMinutes = Math.round(minutes);

    if (rHours > 0) {
      return `${rHours} ${rHours > 1 ? 'hours' : 'hour'} and ${rMinutes} ${rMinutes > 1 ? 'minutes' : 'minute'}.`;
    } else {
      return `${rMinutes} ${rMinutes > 1 ? 'minutes' : 'minute'}.`;
    }
  };

  let runBurn = Math.round((props.calories / 100) * 10) / 10;
  let cycleBurn = timeConverter((Math.round((props.calories / 600) * 10) / 10) * 60);
  let weightBurn = timeConverter((Math.round((props.calories / 250) * 10) / 10) * 60);
  let sexBurn = timeConverter(Math.round((props.calories / 150) * 10) / 10);

  return props.calories !== '' && props.calories !== 0 ? (
    <div className='smallContainer'>
      {props.calories > 250 ? (
        <Total text={`Wow that's ${props.calories} calories.`} />
      ) : (
        <Total text={`Not too bad, only ${props.calories} calories.`} />
      )}

      <h3>To burn that you have to:</h3>
      <Exercises text={`Run ${runBurn} ${runBurn === 1 ? 'mile' : 'miles'}`} />
      <p>Or</p>
      <Exercises text={`Cycle for ${cycleBurn}`} />
      <p>Or</p>
      <Exercises text={`Lift weights for ${weightBurn}`} />
      <p>Or</p>
      <Exercises text={`Make sex for ${sexBurn}`} />

      <Btn className='btn' onClick={props.onClick} text={'Wait I ate more stuff'} />
    </div>
  ) : null;
};

const Loader = () => {
  return <img className='loader' src={require('./images/burger.png')} alt='burger' />;
};

const Fail = (props) => {
  return (
    <div>
      <p>{props.text}</p>
      <Btn className='btn' onClick={props.onClick} text={'Try again'} />
    </div>
  );
};

const Btn = (props) => {
  return (
    <button className='btn' onClick={props.onClick}>
      {props.text}
    </button>
  );
};

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      calories: '',
      loading: false,
      loaded: false,
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
    if (this.state.inputValue !== '') {
      this.setState({
        calories: '',
        loading: true,
      });
      this.getTodayData(this.state.inputValue);
    }
  }

  getTodayData = async (food) => {
    try {
      const response = await fetch(
        `https://edamam-edamam-nutrition-analysis.p.rapidapi.com/api/nutrition-data?nutrition-type=logging&ingr=${food}`,
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
        loading: false,
        loaded: true,
      });
    } catch (err) {}
  };

  render() {
    return (
      <div className='main'>
        {!this.state.loaded ? (
          <GetInput input={this.state.inputValue} handleChange={this.handleChange} handleSubmit={this.handleSubmit} />
        ) : null}

        {this.state.loading && this.state.inputValue !== '' ? <Loader /> : null}

        {this.state.calories !== '' && this.state.calories !== 0 ? (
          <Exercise
            calories={this.state.calories}
            onClick={() => this.setState({ inputValue: '', calories: '', loading: false, loaded: false })}
          />
        ) : null}

        {this.state.calories === 0 ? (
          <Fail
            text={'Something went wrong'}
            onClick={() => this.setState({ inputValue: '', calories: '', loading: false, loaded: false })}
          />
        ) : null}
      </div>
    );
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(<Container />, domContainer);
