import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Loader";
import StartScreen from "./StartScreen";
import Question from "./Question";

const initialState = {
  question: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0
};

const reducer = function (state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        question: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case 'start':
      return {
        ...state,
        status: 'active'
      }
    default:
      throw new Error("Invalid request");
  }
};

function App() {
  // useReducer per creare ed aggiornare gli state
  // destrutturiamo lo state con le proprietà che ci servono
  const [{ question, status, index }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = question.length
  // useEffect per fare la richiesta al server
  useEffect(function () {
    async function getData() {
      try {
        const res = await fetch(`http://localhost:9000/questions`);
        if (!res.ok) throw new Error("INVALID REQUEST");
        const data = await res.json();
        console.log(data);
        dispatch({ type: "dataReceived", payload: data });
        console.log(data);
      } catch (e) {
        dispatch({ type: "dataFailed" });
      }
    }
    getData();
  }, []);
  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen questions={numQuestions} dispatch={dispatch}/>}
        {status === 'active' && <Question questions={question[index]}/>}

      </Main>
    </div>
  );
}

export default App;
