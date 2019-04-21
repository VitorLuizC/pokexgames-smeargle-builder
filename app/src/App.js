import './App.css';
import moves from './data.json';
import React, { useState } from 'react';

function App() {
  const [ term, setTerm ] = useState('');

  return (
    <main className="App">
      <form onSubmit={ event => event.preventDefault() }>
        <input type="search" value={ term } onChange={ event => setTerm(event.target.value) } />
      </form>

      <table>
        <thead></thead>
        <tbody>
            {
              moves.filter(move => {
                if (!term)
                  return true;
                return [move.name, move.type, move.pokemon.name].some(text => text.includes(term));
              }).slice(0, 50).map((move) => (
                <tr key={ move.id }>
                  <td>{ move.id }</td>
                  <td>{ move.position }</td>
                  <td>
                    <a href={ move.pokemon.link } rel="noopener noreferrer" target="_blank">
                      <img
                        className="icon"
                        src={ move.pokemon.icon }
                        alt={ move.pokemon.name }
                        title={ move.pokemon.name }
                      />
                      <span className="name">{ move.pokemon.name }</span>
                    </a>
                  </td>
                  <td>{ move.name }</td>
                  <td>{ move.type }</td>
                  <td>{ move.cooldown }s</td>
                  <td>{ move.level }</td>
                </tr>
              ))
            }
        </tbody>
      </table>
    </main>
  );
}

export default App;
