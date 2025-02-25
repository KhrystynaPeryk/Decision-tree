import React, { useState, useEffect, useRef } from "react";
import data from "../data/data.json";
import * as d3 from "d3";
import SummaryBox from "./SummaryBox";
import "./DecisionTree.css"
import Fireworks from "./Fireworks";

const DecisionTree = () => {
  const [history, setHistory] = useState([{ node: data, selectedOption: null }]);
  const [isEnd, setIsEnd] = useState(false);

  const svgRef = useRef(null);
  const boxRefs = useRef({});

  // Attach a ref to each question box so we can get its position.
  const setBoxRef = (index, node) => {
    if (node) {
      boxRefs.current[index] = node;
    }
  };

  // Clicking an option at stepIndex:
  // 1) Remove any future steps in history.
  // 2) Remove any existing arrows for those future steps.
  // 3) Add next step if available, or mark the tree as ended.
  const handleOptionClick = (stepIndex, option, optionIndex) => {
    // Remove lines from the clicked step onward
    const svg = d3.select(svgRef.current);
    for (let i = stepIndex; i < history.length; i++) {
      svg.selectAll(`.arrow-line-${i}`).remove();
    }

    // Slice history so we keep only up to the clicked step
    const newHistory = history.slice(0, stepIndex + 1);
    // Update the clicked step's selected option
    newHistory[stepIndex] = {
      ...newHistory[stepIndex],
      selectedOption: optionIndex,
    };

    // If there's a next question, add it; otherwise end.
    if (option.next) {
      newHistory.push({ node: option.next, selectedOption: null });
      setIsEnd(false);
    } else {
      setIsEnd(true);
    }

    setHistory(newHistory);
  };

  // Whenever history grows by one step, animate a new arrow from the previous box to the new one.
  useEffect(() => {
    if (history.length < 2) return;

    // The arrow we draw will be from the second-last step to the last step
    const currentIndex = history.length - 2; // from step
    const nextIndex = history.length - 1;    // to step

    const currentBox = boxRefs.current[currentIndex];
    const nextBox = boxRefs.current[nextIndex];
    if (!currentBox || !nextBox) return;

    // Get the bounding boxes
    const currentRect = currentBox.getBoundingClientRect();
    const nextRect = nextBox.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();

    // Calculate start/end points (center bottom of current → center top of next)
    const x1 = currentRect.left + currentRect.width / 2 - svgRect.left;
    const y1 = currentRect.bottom - svgRect.top;
    const x2 = nextRect.left + nextRect.width / 2 - svgRect.left;
    const y2 = nextRect.top - svgRect.top;

    // Draw and animate the arrow line
    const svg = d3.select(svgRef.current);
    const line = svg
      .append("line")
      // Give this arrow a class so we can remove it if the user reselects
      .attr("class", `arrow-line-${currentIndex}`)
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x1)
      .attr("y2", y1)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    line
      .transition()
      .duration(1000)
      .attr("x2", x2)
      .attr("y2", y2);
  }, [history]);

  // Collect selected "name" values for the summary
  const computeSummary = () => {
    return history.reduce((acc, step) => {
      if (step.selectedOption !== null) {
        const name = step.node.options[step.selectedOption].name;
        if (name) acc.push(name);
      }
      return acc;
    }, []);
  };

  const startOver = () => {
    d3.select(svgRef.current).selectAll("line").remove();
    setIsEnd(false)
    setHistory([{ node: data, selectedOption: null }])
  }

  return (
    <>
    <div className={`tree-container ${isEnd ? "blur" : ""}`}>
      <svg
        ref={svgRef}
        id="svg-container"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
          </marker>
        </defs>
      </svg>

      {history.map((step, stepIndex) => (
        <div
          key={stepIndex}
          className="question-box"
          ref={(node) => setBoxRef(stepIndex, node)}
          style={{ top: stepIndex * 140 }}
        >
          <h3 className="question-label">{step.node.question.label}</h3>
          <div className="options">
            {step.node.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(stepIndex, option, index)}
                className={step.selectedOption === index ? "option-btn selected" : "option-btn"}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ))}

    </div>
    {isEnd && (
        <>
          <SummaryBox dataList={computeSummary()} startOver={startOver}/>
          <Fireworks />
        </>
      )}
    </>
  );
};

export default DecisionTree;
