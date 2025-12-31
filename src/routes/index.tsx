import { createFileRoute, Link } from "@tanstack/react-router";
import "../App.css";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {
    return (
        <div className="app">
            <h1>TheChar</h1>
            <h2>Practice Japanese characters.</h2>
            <div className="lesson-category">
                <Link to="/hiragana" className="lesson">
                    Hiragana
                </Link>
                <Link to="/katakana" className="lesson">
                    Katakana
                </Link>
            </div>
        </div>
    );
}
