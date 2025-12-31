import { useEffect, useMemo, useRef, useState } from "react";
import "../css/design.css";

type CharacterQuizProps = {
    characterMap: { [key: string]: string };
};

export default function CharacterQuiz({ characterMap }: CharacterQuizProps) {
    const [shuffledMap, setShuffledMap] = useState<{ [key: string]: string }>({});
    const [currentState, setCurrentState] = useState<number>(0);
    const [inputValue, setInputValue] = useState<string>("");
    const [isWrongAnswer, setIsWrongAnswer] = useState<boolean>(false);
    const [animatePulse, setAnimatePulse] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const keys = useMemo(() => Object.keys(shuffledMap), [shuffledMap]);
    const totalItems = keys.length;
    const progress = totalItems > 0 ? (currentState / totalItems) * 100 : 0;

    useEffect(() => {
        setShuffledMap(shuffleObject(characterMap));
    }, [characterMap]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [currentState, isWrongAnswer]);

    const isSubmitDisabled = inputValue.trim() === "";

    const gameContinue = () => {
        const answer = inputRef.current?.value.trim().toLowerCase();
        const correctAnswer = keys[currentState];

        if (answer === correctAnswer) {
            setInputValue("");
            setIsWrongAnswer(false);
            setAnimatePulse(true);
            setTimeout(() => setAnimatePulse(false), 300);
            setCurrentState((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
        } else {
            setIsWrongAnswer(true);
            setInputValue("");
            // Auto hide wrong message after 2s or on next input
        }
    };

    return (
        <div className="app-ui">
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="count">
                Character {currentState + 1} of {totalItems}
            </span>
            <div className={`character ${animatePulse ? "pulse" : ""}`}>
                {shuffledMap[keys[currentState]]}
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    gameContinue();
                }}
            >
                <div className="input-container">
                    <input
                        type="text"
                        ref={inputRef}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            if (isWrongAnswer) setIsWrongAnswer(false);
                        }}
                        value={inputValue}
                        className={isWrongAnswer ? "wrong" : ""}
                        placeholder="Type romaji..."
                        autoComplete="off"
                    />
                </div>
                {isWrongAnswer && (
                    <span className="message">
                        Not quite! The correct romaji for "{shuffledMap[keys[currentState]]}" is "{keys[currentState]}".
                    </span>
                )}
                <button type="submit" disabled={isSubmitDisabled}>
                    {isWrongAnswer ? "Try Again" : "Check Answer"}
                </button>
            </form>
        </div>
    );
}

function shuffleObject(obj: { [key: string]: string }) {
    const entries = Object.entries(obj);
    for (let i = entries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    return Object.fromEntries(entries);
}
