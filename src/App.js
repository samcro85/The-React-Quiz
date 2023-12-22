import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Loader";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./component/NextButton";
import Progress from "./component/Progress";

const initialState = {
  questions: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
};

const reducer = function (state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      console.log(question);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index++,
        answer: null,
      };
    default:
      throw new Error("Invalid request");
  }
};

function App() {
  // useReducer per creare ed aggiornare gli state
  // destrutturiamo lo state con le proprietà che ci servono
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions = questions.length;
  const maxpoints = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );
  // useEffect per fare la richiesta al server
  useEffect(function () {
    async function getData() {
      try {
        const res = await fetch(`http://localhost:9000/questions`);
        if (!res.ok) throw new Error("INVALID REQUEST");
        const data = await res.json();
        console.log(data);
        dispatch({ type: "dataReceived", payload: data });
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
        {status === "ready" && (
          <StartScreen questions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxpoints={maxpoints}
              answer={answer}
            />
            <Question
              questions={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
