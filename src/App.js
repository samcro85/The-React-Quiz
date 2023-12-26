import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Loader";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./component/NextButton";
import Progress from "./component/Progress";
import FinishScreen from "./component/FinishScreen";
import Timer from "./component/Timer";
import Footer from "./component/Footer";

const SECS_PER_QUESTION = 30
const initialState = {
  questions: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null
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
        secondsRemaining: state.questions.length * SECS_PER_QUESTION  
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
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };

      case "tick":
        return {
          ...state,
          secondsRemaining: state.secondsRemaining--,
          status: state.secondsRemaining === 0 ? 'finished': state.status
        }
    default:
      throw new Error("Invalid request");
  }
};

function App() {
  // useReducer per creare ed aggiornare gli state
  // destrutturiamo lo state con le proprietà che ci servono
  const [{ questions, status, index, answer, points, highScore, secondsRemaining }, dispatch] =
    useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce(
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
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              questions={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
