import Options from "./component/Options"

function Question({questions}) {
   const {question, options, correctOption, points} = questions
    return (
        <div>
           <h4>{question}</h4> 
           <Options options={options}/>
        </div>
    )
}

export default Question
