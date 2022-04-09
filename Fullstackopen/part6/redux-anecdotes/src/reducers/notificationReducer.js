const intialState = '';

const notificationReducer = (state = intialState, action) => {
    console.log('notification state now: ', state);
    console.log('action', action);

    switch(action.type) {
        case 'SET_NOTIFICATION':
            return action.data
        default:
            return state
    }
}

export const setNotification = (message) => {
    return {
        type: 'SET_NOTIFICATION',
        data: message
    }
}

export default notificationReducer