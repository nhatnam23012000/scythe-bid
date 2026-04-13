import { useReducer } from 'react';
import { gameReducer, initialState } from './state/gameReducer.js';
import SetupScreen from './components/SetupScreen.jsx';
import BiddingScreen from './components/BiddingScreen.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import './App.css';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <div className="app">
      {state.phase === 'setup' && (
        <SetupScreen state={state} dispatch={dispatch} />
      )}
      {state.phase === 'bidding' && (
        <BiddingScreen state={state} dispatch={dispatch} />
      )}
      {state.phase === 'results' && (
        <ResultsScreen state={state} dispatch={dispatch} />
      )}
    </div>
  );
}
