import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { filterAnecdotes } from '../reducers/filterReducer';

const Filter = () => {
    const dispatch = useDispatch();
    const anecdotes = useSelector(state => state.anecdotes);

    const handleChange = (event) => {
        dispatch(filterAnecdotes(event.target.value, anecdotes));
    }

    const style = {
        marginBottom: 10,
        marginTop: 10
    };

    return (
        <div style={style}>
            filter <input onChange={handleChange} />
        </div>
    );
}

export default Filter