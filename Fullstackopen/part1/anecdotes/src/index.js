import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import './index.css';

import IconLabelButtons from './iconbuttonlib';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AddIcon from '@material-ui/icons/Add';

const DisplayVoteCount = ({voteCount}) => <div><p>has {voteCount} votes</p></div>

const DisplayAnecdoteWithMostVotes = ({anectdotesVoteList}) => {
    const temp = [...anectdotesVoteList];

    const anecdoteWithMostVotes = temp.sort(function(a, b) { 
        return b.count - a.count;
    })[0];

    if(anecdoteWithMostVotes.count > 0) {
        return(
            <div>
                <h1>Anecdote with the most votes</h1>
                <p>{anecdotes[anecdoteWithMostVotes.index]}</p>
                <DisplayVoteCount voteCount={anecdoteWithMostVotes.count} />
            </div>
        )
    } else {
        return null;
    }
}

const App = (props) => {
    const [selected, setSelected] = useState(0);

    const tempList = [];

    let index = 0;
    const length = anecdotes.length;

    for(index; index < length; index++) {
        tempList.push({index: index, count: 0});
    }

    const [anectdotesVoteList, setVoteCount] = useState([...tempList]);

    const handleVoteClick = () => {
        const copy = [...anectdotesVoteList];
        copy[selected].count++;
        setVoteCount(copy);
    }

     const handleNextClick = () => {
        const randomIndex = Math.floor(Math.random() * anecdotes.length);
        randomIndex !== selected ? setSelected(randomIndex) : handleNextClick();
    }

    return (
        <div>
            <h1>Anecdote of the day</h1>
            <p>{props.anecdotes[selected]}</p>
            <DisplayVoteCount voteCount={anectdotesVoteList[selected].count}/>
            <div>
                {IconLabelButtons("contained", "primary", "Vote", <AddIcon/>, handleVoteClick)}
                {IconLabelButtons("contained", "primary", "Next", <NavigateNextIcon/>, handleNextClick)}
            </div>
            <DisplayAnecdoteWithMostVotes anectdotesVoteList={anectdotesVoteList}/>
        </div>
    )
}

const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)