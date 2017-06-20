export default (state = [], action) => {
  switch (action.type){
    // Check if action dispatched is
    // CREATE_BOOK and act on that
    case 'CREATE_BOOK':
       /**
        * reducers are pure functions, therefore;
        * they can't mutate data
        * this -- 'state.push(action.book);'  wont work
        */
        // we can return a new array which contains new book
         return [
          ...state,
          Object.assign({}, action.book)
        ];
    default:
       return state;
  }
};