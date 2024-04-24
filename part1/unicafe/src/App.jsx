import { useState } from 'react'


const StatisticLine = ({ prefix, value, suffix }) => (
  <tr>
    <td>{prefix}</td>
    <td>{value}</td>
    <td>{suffix}</td>
  </tr>
)


const Button = ({ text, onClick }) => (
  <button onClick={onClick}>{text}</button>
)


const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  if (all === 0) {
    return (
      <p>No feedback given</p>
    )
  } else {
    return (
      <table>
        <tbody>
        <StatisticLine prefix='good' value={good} />
        <StatisticLine prefix='neutral' value={neutral} />
        <StatisticLine prefix='bad' value={bad} />
        <StatisticLine prefix='all' value={all} />
        <StatisticLine prefix='average' value={(good - bad) / all} />
        <StatisticLine prefix='positive' value={(good / all) * 100} suffix='%' />
        </tbody>
      </table>
    )
  }
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text='good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onClick={() => setBad(bad + 1)} text='bad' />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App