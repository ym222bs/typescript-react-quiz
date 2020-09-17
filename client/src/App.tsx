import React, { useState } from 'react'
import QuestionCard from './components/QuestionCard'
import { fetchQuizQuestions } from './API'
import { QuestionState, Difficulty } from './API'
import { GlobalStyle, Wrapper } from './App.styles'

export type AnswerObject = {
    question: string
    answer: string
    correct: boolean
    correctAnswer: string
}

const TOTAL_QUESTIONS = 10

const App = () => {
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState<QuestionState[]>([])
    const [number, setNumber] = useState(0)
    const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
    const [score, setScore] = useState(0)
    const [gameOver, setGameOver] = useState(true)

    const startTrivia = async () => {
        setLoading(true)
        setGameOver(false)
        // TODO: Use try catch here and whenever fetching
        const newQuestions = await fetchQuizQuestions(
            TOTAL_QUESTIONS,
            Difficulty.EASY
        )

        setQuestions(newQuestions)
        setScore(0)
        setUserAnswers([])
        setNumber(0)
        setLoading(false)
    }
    const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!gameOver) {
            const answer = e.currentTarget.value
            // Check the given answer with the correct answer
            const correct = questions[number].correct_answer === answer
            // Add score if answer is correct
            if (correct) setScore((prev) => prev + 1)
            // Save the answer to the array of userAnswers
            const anwserObject = {
                question: questions[number].question,
                answer,
                correct,
                correctAnswer: questions[number].correct_answer,
            }
            setUserAnswers((prev) => [...prev, anwserObject])
        }
    }

    const nextQuestion = () => {
        const nextQuestion = number + 1
        // Move to the next question if it is not the last
        if (nextQuestion === TOTAL_QUESTIONS) {
            setGameOver(true)
        } else {
            setNumber(nextQuestion)
        }
    }

    return (
        <>
            <GlobalStyle />
            <Wrapper>
                <h1>Quiz</h1>
                {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
                    <button className='start' onClick={startTrivia}>
                        Start
                    </button>
                ) : null}
                {!gameOver ? <p className='score'>Score:{score}</p> : null}
                {loading && <p>Loading Questiones...</p>}
                {!loading && !gameOver && (
                    <QuestionCard
                        question={questions[number].question}
                        answers={questions[number].answers}
                        callback={checkAnswer}
                        userAnswer={
                            userAnswers ? userAnswers[number] : undefined
                        }
                        questionNr={number + 1}
                        totalQuestions={TOTAL_QUESTIONS}
                    />
                )}
                {!gameOver &&
                !loading &&
                userAnswers.length === number + 1 &&
                number !== TOTAL_QUESTIONS - 1 ? (
                    <button className='next' onClick={nextQuestion}>
                        Next Question
                    </button>
                ) : null}
            </Wrapper>
        </>
    )
}

export default App
