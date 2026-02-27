import React from 'react';
import Auth from './components/Auth';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Docker & Node.js POC</h1>
        <p>A simple full-stack app containerized with Docker</p>
      </header>
      <main>
        <Auth />
      </main>
    </div>
  );
}

export default App;
