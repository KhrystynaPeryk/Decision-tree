import React, { useState, useEffect, useRef } from "react";
import data from "../data/data.json";
import * as d3 from "d3";
import SummaryBox from "./SummaryBox";
import "./DecisionTree.css";
import Arrow from "./Arrow";

const DecisionTree = () => {
  const [history, setHistory] = useState([{ node: data, selectedOption: null }]);
  const [isEnd, setIsEnd] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const svgRef = useRef(null);
  const treeContainerRef = useRef(null);
  const boxRefs = useRef({});
  const newBoxPositionRef = useRef(0);
  const drawnArrowsRef = useRef(new Set()); // Track which arrows have been drawn
  const appContainerRef = useRef(null);

  // Attach a ref to each question box so we can get its position.
  const setBoxRef = (index, node) => {
    if (node) {
      boxRefs.current[index] = node;
    }
  };

  const handleOptionClick = (stepIndex, option, optionIndex) => {
    // Calculate where the new box will be positioned before adding it
    if (stepIndex === history.length - 1 && option.next) {
      const currentBox = boxRefs.current[stepIndex];
      if (currentBox) {
        // Pre-calculate where the next box should be positioned
        newBoxPositionRef.current = parseInt(currentBox.style.top || "0") + currentBox.offsetHeight + 70;
      }
    }
    
    setIsUpdating(true); // Signal that we're about to update
    
    const svg = d3.select(svgRef.current);
    
    // Only remove the arrows from the current step and beyond
    for (let i = stepIndex; i < history.length; i++) {
      svg.selectAll(`.arrow-line-${i}`).remove();
      drawnArrowsRef.current.delete(i); // Remove from drawn arrows set
    }
    
    const newHistory = history.slice(0, stepIndex + 1);
    newHistory[stepIndex] = {
      ...newHistory[stepIndex],
      selectedOption: optionIndex,
    };
    
    if (option.next) {
      newHistory.push({ node: option.next, selectedOption: null });
      setIsEnd(false);
    } else {
      setIsEnd(true);
    }
    
    setHistory(newHistory);
  };

  // Draw a new arrow when history changes
  const drawArrow = (i) => {
    const currentBox = boxRefs.current[i];
    const nextBox = boxRefs.current[i + 1];
    if (!currentBox || !nextBox) return;

    const currentRect = currentBox.getBoundingClientRect();
    const nextRect = nextBox.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();

    const x1 = currentRect.left + currentRect.width / 2 - svgRect.left;
    const y1 = currentRect.bottom - svgRect.top;
    const x2 = nextRect.left + nextRect.width / 2 - svgRect.left;
    const y2 = nextRect.top - svgRect.top;

    const svg = d3.select(svgRef.current);
    
    // Remove any existing arrow for this step
    svg.selectAll(`.arrow-line-${i}`).remove();
    
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
    
    // Mark this arrow as drawn
    drawnArrowsRef.current.add(i);
  };

  // Update box positions and draw arrows
  const updateBoxPositionsAndDrawArrows = () => {
    // Update box positions
    for (let i = 0; i < history.length; i++) {
      const box = boxRefs.current[i];
      if (!box) continue;
      
      let currentPosition = 0;
      if (i === 0) {
        currentPosition = 0;
      } else {
        const prevBox = boxRefs.current[i - 1];
        if (prevBox) {
          // Position this box 70px below the bottom of the previous box
          currentPosition = parseInt(prevBox.style.top || "0") + prevBox.offsetHeight + 70;
        } else {
          currentPosition = i * 70;
        }
      }
      
      box.style.top = `${currentPosition}px`;
    }
    
    // Only draw missing arrows
    for (let i = 0; i < history.length - 1; i++) {
      if (!drawnArrowsRef.current.has(i)) {
        drawArrow(i);
      } else if (i === history.length - 2) {
        // Only redraw the last arrow - this fixes cases where the new box position 
        // might have changed during rendering
        drawArrow(i);
      }
    }
    
    // Update SVG height
    if (treeContainerRef.current && svgRef.current) {
      const lastBox = boxRefs.current[history.length - 1];
      if (lastBox) {
        const lastBoxRect = lastBox.getBoundingClientRect();
        const totalHeight = lastBoxRect.bottom - treeContainerRef.current.getBoundingClientRect().top + 50;
        svgRef.current.style.height = `${totalHeight}px`;
      }
    }
    
    setIsUpdating(false); // Signal that update is complete
  };

  // Effect to update boxes position and draw arrows
  useEffect(() => {
    // Allow the DOM to settle first
    const timer = setTimeout(() => {
      updateBoxPositionsAndDrawArrows();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [history]);

  // Redraw all arrows on window resize
  useEffect(() => {
    const handleResize = () => {
      // On resize, we need to redraw all arrows regardless of whether they've been drawn before
      const svg = d3.select(svgRef.current);
      svg.selectAll("line").remove();
      drawnArrowsRef.current.clear();
      
      updateBoxPositionsAndDrawArrows();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [history]);

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
    drawnArrowsRef.current.clear();
    setIsEnd(false);
    setHistory([{ node: data, selectedOption: null }]);
  };

  useEffect(() => {
    if (appContainerRef.current) {
      if (isEnd) {
        appContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        appContainerRef.current.scrollTo({
          top: appContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [history, isEnd]);

  return (
    <div className="app-container" ref={appContainerRef}>
      <div className="tree-container" ref={treeContainerRef}>
        <Arrow svgRef={svgRef} />
        {history.map((step, stepIndex) => {
          // Determine initial position for the box
          let initialPosition;
          if (stepIndex === 0) {
            initialPosition = 0;
          } else if (stepIndex === history.length - 1 && isUpdating) {
            // For newly added box, use the pre-calculated position
            initialPosition = newBoxPositionRef.current;
          } else {
            // For existing boxes, use current position
            const prevBox = boxRefs.current[stepIndex - 1];
            if (prevBox) {
              initialPosition = parseInt(prevBox.style.top || "0") + prevBox.offsetHeight + 70;
            } else {
              initialPosition = stepIndex * 70;
            }
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