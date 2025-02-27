import React, { useState, useEffect, useRef } from "react";
import data from "../data/data.json";
import * as d3 from "d3";
import SummaryBox from "./SummaryBox";
import "./DecisionTree.css";
import Arrow from "./Arrow";

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

  // Extract the common arrow drawing logic
  const drawArrow = (i) => {
    const currentBox = boxRefs.current[i];
    const nextBox = boxRefs.current[i + 1];
    if (!currentBox || !nextBox) return;

    // Get the bounding boxes of the current and next boxes, and the svg container
    const currentRect = currentBox.getBoundingClientRect();
    const nextRect = nextBox.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();

    // Calculate start (center bottom of current) and end (center top of next)
    const x1 = currentRect.left + currentRect.width / 2 - svgRect.left;
    const y1 = currentRect.bottom - svgRect.top;
    const x2 = nextRect.left + nextRect.width / 2 - svgRect.left;
    const y2 = nextRect.top - svgRect.top;

    const svg = d3.select(svgRef.current);
    const line = svg
      .append("line")
      .attr("class", `arrow-line-${i}`)
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x1)
      .attr("y2", y1)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    line.transition().duration(1000).attr("x2", x2).attr("y2", y2);
  };

  // Draw a new arrow when history grows by one step.
  useEffect(() => {
    if (history.length < 2) return;
    const currentIndex = history.length - 2;
    drawArrow(currentIndex);
  }, [history]);

  // Redraw all arrows on window resize.
  useEffect(() => {
    const redrawArrows = () => {
      const svg = d3.select(svgRef.current);
      svg.selectAll("line").remove();
      for (let i = 0; i < history.length - 1; i++) {
        drawArrow(i);
      }
    };

    const handleResize = () => {
      // Optionally debounce here if needed
      redrawArrows();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [history]);

  // Collect selected "name" values for the summary.
  const computeSummary = () => {
    return history.reduce((acc, step) => {
      if (step.selectedOption !== null) {
        // "name" property from data.json
        const name = step.node.options[step.selectedOption].name;
        if (name) acc.push(name);
      }
      return acc;
    }, []);
  };

  const startOver = () => {
    d3.select(svgRef.current).selectAll("line").remove();
    setIsEnd(false);
    setHistory([{ node: data, selectedOption: null }]);
  };

  return (
    <div className="app-container">
      <div className="tree-container">
        <Arrow svgRef={svgRef} />

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
                  className={
                    step.selectedOption === index ? "option-btn selected" : "option-btn"
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SummaryBox
        dataList={computeSummary()}
        startOver={startOver}
        isOpen={isEnd} // show the drawer when the decision tree ends
      />
    </div>
  );
};

export default DecisionTree;
