function StartScreen({questions}) {
    return (
        <div className="start">
           <h2>Welcome to The React Quiz!</h2> 
           <h3>{questions} questions to test your React mastery</h3>
           <button>Let's start</button>
        </div>
    )
}

export default StartScreen