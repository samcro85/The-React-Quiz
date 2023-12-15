import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";

const initialState ={
  question: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: 'loading'
}

const reducer = function(state, action){
switch(action.type){
  case 'dataReceived':
    return {
      ...state,
      question: action.payload,
      status: 'ready'
    }
  case 'dataFailed':
    return {
      ...state,
      status: 'error'
    }
  default:
    throw new Error('Invalid request')
}
}

function App() {
  // useReducer per creare ed aggiornare gli state
  const [state, dispatch] = useReducer(reducer, initialState)

  // useEffect per fare la richiesta al server
  useEffect(function () {
    async function getData() {
      try {
        const res = await fetch(`http://localhost:9000/questions`);
        if (!res.ok) throw new Error("INVALID REQUEST");
        const data = await res.json();
        console.log(data);
         dispatch({type: 'dataReceived', payload: data})
        console.log(data);
      } catch (e) {
        dispatch({type: 'dataFailed'})
      }
    }
    getData();
  }, []);
  return (
    <div className="app">
      <Header />

      <Main>
        <p>1/15</p>
        <p>Question?</p>
      </Main>
    </div>
  );
}

export default App;
