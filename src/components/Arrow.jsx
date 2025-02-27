
const Arrow = ({svgRef}) => {
    return (
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
    )
}

export default Arrow