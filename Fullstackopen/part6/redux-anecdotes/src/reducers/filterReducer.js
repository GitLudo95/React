const intialState = [];

const filterReducer = (state = intialState, action) => {
    console.log('filter state now: ', state);
    console.log('action', action);

    switch(action.type) {
        case 'FILTER_ANECDOTES':
            const data = action.data;
            return data.anecdotes.filter((anecdote) => anecdote.content.toLowerCase().includes(data.filter.toLowerCase()));
        default:
            return state;
    }
}

export const filterAnecdotes = (filter, anecdotes) => {
    return {
        type: 'FILTER_ANECDOTES',
        data: { filter, anecdotes }
    };
}

export default filterReducer