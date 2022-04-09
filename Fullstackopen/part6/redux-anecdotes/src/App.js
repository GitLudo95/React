import React from 'react';
import AnecdoteList from './components/AnecdoteList';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import Filter from './components/Filter';

const App = () => {

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <div>
        <Filter />
      </div>
      <div>
        <AnecdoteList />
      </div>
      <h2>create new</h2>
      <AnecdoteForm />
    </div>
  )
}

export default App