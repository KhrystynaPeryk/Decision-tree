import "./SummaryBox.css"
import { articleMapping } from "../data/articles";
import ReactMarkdown from 'react-markdown'

const SummaryBox = ({ dataList, startOver, isOpen }) => {
    const combinationKey = dataList.join("|");
    const article = articleMapping[combinationKey] || {
        title: "Sorry!",
        markdown: "We don't have specific content for your selection yet.",
    };
    return (
        <div className={`summary-drawer ${isOpen ? "open" : ""}`}>
            <button
                type="button"
                onClick={() => startOver()}
                className="start-over-btn"
            >
                Start Over
            </button>
            <article className="summary-article">
                <h2>{article.title}</h2>
                <ReactMarkdown>{article.markdown}</ReactMarkdown>
            </article>

        </div>
    );
};

export default SummaryBox;