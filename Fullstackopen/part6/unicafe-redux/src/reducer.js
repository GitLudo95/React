const initialState = {
  good: 0,
  ok: 0,
  bad: 0
};

const counterReducer = (state = initialState, action) => {
  console.log(action);
  const newState = {...state};
  switch (action.type) {
    case 'GOOD':
      newState.good++;
      return newState;
    case 'OK':
      newState.ok++;
      return newState;
    case 'BAD':
      newState.bad++;
      return newState;
    case 'ZERO':
      newState.good = 0;
      newState.ok = 0;
      newState.bad = 0;
      return newState;
    default: return state;
  }
  
}

export default counterReducer