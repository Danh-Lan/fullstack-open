import { useState } from 'react'

const Button = (props) => {
  return (
    <button type='button' onClick={props.handleClick}>
      {props.text}
    </button>
  )
};

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td> 
      <td>{props.value}</td>
    </tr>
  )
}


const Statistics = (props) => {
  if (props.good === 0 && props.neutral === 0 && props.bad === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  
  return (
    <table>
      <tbody>
        <StatisticsLine text='good' value={props.good} />
        <StatisticsLine text='neutral' value={props.neutral} />
        <StatisticsLine text='bad' value={props.bad} />
        <StatisticsLine text='all' value={props.good + props.neutral + props.bad} />
        <StatisticsLine text='average' value={(props.good*1 + props.bad*-1) / (props.good + props.neutral + props.bad)} />
        <StatisticsLine text='positive' value={100*props.good / (props.good + props.neutral + props.bad) + ' %'} />
      </tbody>
    </table>
  )
};


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App