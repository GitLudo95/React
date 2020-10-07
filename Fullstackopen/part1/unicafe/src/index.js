import React, { useState, Fragment } from 'react'
import ReactDOM from 'react-dom'

import './index.css';

import IconLabelButtons from './iconbuttonlib';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

const DisplayStatistic = (props) => {
  return(
    <div>
      <p>{props.statistic} : {props.amount}</p>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  const all = (good + neutral + bad) || 0;
  const average = ((good - bad) / all) || 0;
  const positive = (((good / all) * 100) || 0) + '%';

  const hasFeedback = all > 0;

  return (
    <div>
      <h1>give feedback</h1>
      {IconLabelButtons("contained", "primary", "good", <ThumbUpIcon/>, handleGoodClick)}
      {IconLabelButtons("contained", "default", "neutral", <ThumbsUpDownIcon/>, handleNeutralClick)}
      {IconLabelButtons("contained", "secondary", "bad", <ThumbDownIcon/>, handleBadClick)}
      <h1>statistics</h1>
      {hasFeedback ? (
        <Fragment>
          <DisplayStatistic statistic={"good"} amount={good}/>
          <DisplayStatistic statistic={"neutral"} amount={neutral}/>
          <DisplayStatistic statistic={"bad"} amount={bad}/>
          <DisplayStatistic statistic={"all"} amount={all}/>
          <DisplayStatistic statistic={"average"} amount={average}/>
          <DisplayStatistic statistic={"positive"} amount={positive}/>
        </Fragment>
      ) : (
        <p>No feedback given</p>
      )}
  </div>
  )
}

ReactDOM.render(
  <App />, 
  document.getElementById('root')
)
