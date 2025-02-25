import "./SummaryBox.css"

const SummaryBox = ({dataList, startOver}) => {

    return (
        <div className="summary-container">
            <div className="summary-box">
                <h3>Your Selection:</h3>
                <p>{dataList.join(", ")}</p>
                <button type="button" onClick={() => startOver()} className="start-over-btn">Start Over</button>
            </div>
        </div>
    )
}

export default SummaryBox