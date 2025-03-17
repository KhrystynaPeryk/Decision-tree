import React, { useState, useEffect, useRef } from "react";
import data from "../data/data.json";
import * as d3 from "d3";
import SummaryBox from "./SummaryBox";
import "./DecisionTree.css";
import Arrow from "./Arrow";

const ARROW_OFFSET = 70;

const DecisionTree = () => {
  const [history, setHistory] = useState([{ node: data, selectedOption: null }]);
  const [isEnd, setIsEnd] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const svgRef = useRef(null);
  const treeContainerRef = useRef(null);
  const appContainerRef = useRef(null);
  const boxRefs = useRef({});
  const newBoxPositionRef = useRef(0);
  const drawnArrowsRef = useRef(new Set());

  // Helper: assign a ref to each question box
  const setBoxRef = (index, node) => {
    if (node) {
      boxRefs.current[index] = node;
    }
  };

  // Handler: update history when an option is clicked
  const handleOptionClick = (stepIndex, option, optionIndex) => {
    // Pre-calculate next box position if needed
    if (stepIndex === history.length - 1 && option.next) {
      const currentBox = boxRefs.current[stepIndex];
      if (currentBox) {
        newBoxPositionRef.current =
          parseInt(currentBox.style.top || "0") + currentBox.offsetHeight + ARROW_OFFSET;
      }
    }

    setIsUpdating(true);

    // Remove arrows for steps at and beyond the current one
    const svg = d3.select(svgRef.current);
    for (let i = stepIndex; i < history.length; i++) {
      svg.selectAll(`.arrow-line-${i}`).remove();
      drawnArrowsRef.current.delete(i);
    }

    const newHistory = history.slice(0, stepIndex + 1);
    newHistory[stepIndex] = { ...newHistory[stepIndex], selectedOption: optionIndex };

    if (option.next) {
      newHistory.push({ node: option.next, selectedOption: null });
      setIsEnd(false);
    } else {
      setIsEnd(true);
    }
    setHistory(newHistory);
  };

  // Helper: draw a single arrow between box i and i+1
  const drawArrow = (i) => {
    const currentBox = boxRefs.current[i];
    const nextBox = boxRefs.current[i + 1];
    if (!currentBox || !nextBox || !svgRef.current) return;

    const currentRect = currentBox.getBoundingClientRect();
    const nextRect = nextBox.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();

    const x1 = currentRect.left + currentRect.width / 2 - svgRect.left;
    const y1 = currentRect.bottom - svgRect.top;
    const x2 = nextRect.left + nextRect.width / 2 - svgRect.left;
    const y2 = nextRect.top - svgRect.top;

    const svg = d3.select(svgRef.current);
    svg.selectAll(`.arrow-line-${i}`).remove();

    const line = svg.append("line")
      .attr("class", `arrow-line-${i}`)
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x1)
      .attr("y2", y1)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    line.transition().duration(1000).attr("x2", x2).attr("y2", y2);
    drawnArrowsRef.current.add(i);
  };

  // Helper: update box positions and draw missing arrows
  const updatePositionsAndArrows = () => {
    // Update the positions of all question boxes
    for (let i = 0; i < history.length; i++) {
      const box = boxRefs.current[i];
      if (!box) continue;
      let currentPosition = 0;
      if (i === 0) {
        currentPosition = 0;
      } else {
        const prevBox = boxRefs.current[i - 1];
        currentPosition = prevBox
          ? parseInt(prevBox.style.top || "0") + prevBox.offsetHeight + ARROW_OFFSET
          : i * ARROW_OFFSET;
      }
      box.style.top = `${currentPosition}px`;
    }
    // Draw arrows between boxes
    for (let i = 0; i < history.length - 1; i++) {
      if (!drawnArrowsRef.current.has(i)) {
        drawArrow(i);
      } else if (i === history.length - 2) {
        // Redraw the last arrow in case its position changed
        drawArrow(i);
      }
    }
    // Adjust the SVG height so arrows aren't clipped
    if (treeContainerRef.current && svgRef.current) {
      const lastBox = boxRefs.current[history.length - 1];
      if (lastBox) {
        const lastBoxRect = lastBox.getBoundingClientRect();
        const totalHeight =
          lastBoxRect.bottom - treeContainerRef.current.getBoundingClientRect().top + 50;
        svgRef.current.style.height = `${totalHeight}px`;
      }
    }
    setIsUpdating(false);
  };

  // Effect: update positions and arrows after history changes
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePositionsAndArrows();
    }, 50);
    return () => clearTimeout(timer);
  }, [history]);

  // Effect: redraw arrows on window resize
  useEffect(() => {
    const handleResize = () => {
      const svg = d3.select(svgRef.current);
      svg.selectAll("line").remove();
      drawnArrowsRef.current.clear();
      updatePositionsAndArrows();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [history]);

  // Effect: scroll the outer container based on state changes
  useEffect(() => {
    if (appContainerRef.current) {
      if (isEnd) {
        appContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        appContainerRef.current.scrollTo({
          top: appContainerRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    }
  }, [history, isEnd]);

  // Compute summary based on history
  const computeSummary = () =>
    history.reduce((acc, step) => {
      if (step.selectedOption !== null) {
        const name = step.node.options[step.selectedOption].name;
        if (name) acc.push(name);
      }
      return acc;
    }, []);

  const startOver = () => {
    d3.select(svgRef.current).selectAll("line").remove();
    drawnArrowsRef.current.clear();
    setIsEnd(false);
    setHistory([{ node: data, selectedOption: null }]);
  };

  return (
    <div className="app-container" ref={appContainerRef}>
      <div className="tree-container" ref={treeContainerRef}>
        <Arrow svgRef={svgRef} />
        {history.map((step, stepIndex) => {
          let initialPosition;
          if (stepIndex === 0) {
            initialPosition = 0;
          } else if (stepIndex === history.length - 1 && isUpdating) {
            initialPosition = newBoxPositionRef.current;
          } else {
            const prevBox = boxRefs.current[stepIndex - 1];
            initialPosition = prevBox
              ? parseInt(prevBox.style.top || "0") + prevBox.offsetHeight + ARROW_OFFSET
              : stepIndex * ARROW_OFFSET;
          }
          return (
            <div
              key={stepIndex}
              className="question-box"
              ref={(node) => setBoxRef(stepIndex, node)}
              style={{ top: initialPosition }}
            >
              <h3 className="question-label">{step.node.question.label}</h3>
              <div className="options">
                {step.node.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionClick(stepIndex, option, index)}
                    className={step.selectedOption === index ? "option-btn selected" : "option-btn"}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <SummaryBox dataList={computeSummary()} startOver={startOver} isOpen={isEnd} />
    </div>
  );
};

export default DecisionTree;