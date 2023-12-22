import Options from "./component/Options";

function Question({ questions, dispatch, answer }) {
  const { question, options, correctOption } = questions;
  console.log(questions);
  return (
    <div>
      <h4>{question}</h4>
      <Options
        options={options}
        dispatch={dispatch}
        answer={answer}
        correctOpt={correctOption}
      />
    </div>
  );
}

export default Question;
