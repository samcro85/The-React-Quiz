function Options({ options, dispatch, answer, correctOpt }) {
    const hasAnswered = answer !== null
  return (
    <div className="options">
      {options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? 'answer' : ''} ${(hasAnswered && index === correctOpt)?
             'correct':
              'wrong'}`}
          key={option}
          disabled ={hasAnswered}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
