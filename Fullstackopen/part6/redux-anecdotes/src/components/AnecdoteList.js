import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { voteForAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const Anecdote = ({ anecdote, handleClick }) => {
    return(
        <li>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleClick}>vote</button>
            </div>
        </li>
    );
}

const AnecdoteList = () => {
    const dispatch = useDispatch();
    let anecdotes = useSelector(state => state.anecdotes);
    const filteredAnecdotes = useSelector(state => state.filter);
    anecdotes = (filteredAnecdotes && filteredAnecdotes.length > 0) ? filteredAnecdotes : anecdotes;

    anecdotes.sort((a, b) => {
        if(a.votes > b.votes) return -1;
        if(a.votes < b.votes) return 1;
    })

    const vote = (anecdote) => {
        dispatch(voteForAnecdote(anecdote.id));
        dispatch(setNotification(`You voted '${anecdote.content}'`));
        setTimeout(() => {         
            dispatch(setNotification(''));
        }, 5000)
    }

    return(
        <ul>
            {anecdotes.map(anecdote =>
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleClick={() =>
                        vote(anecdote)
                    }
                />
            )}
        </ul>
    );
}

export default AnecdoteList