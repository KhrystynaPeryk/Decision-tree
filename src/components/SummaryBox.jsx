import "./SummaryBox.css"

const SummaryBox = ({dataList, startOver}) => {
console.log(dataList)
    return (
        <div className="summary-container">
            <div className="summary-box">
                <h3>Your Selection:</h3>
                <ul className="summary-list">
                    {dataList.map((item, index) => <li className="summary-item" key={index}>{item}</li>)}
                </ul>
                <button type="button" onClick={() => startOver()} className="start-over-btn">Start Over</button>
            </div>
        </div>
    )
}

export default SummaryBox