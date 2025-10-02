import { useState } from "react";
import PropTypes from "react"

const containerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",

};

const starContainerStyle = {
    display: "flex",
};


StarComp.propTypes = {
    maxRating: PropTypes.number,
    fill : PropTypes.string,
    message : PropTypes.array
}

export default function StarComp({ maxRating = 5, fill = "orange", message = [], onSetRating }) {
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)


    function handleMouseEnter(v){
        setHoveredRating(v)
    }
    function handleMouseLeave(v) {
        setHoveredRating(v)
    }

    function handleRating(x){
     setRating(x)
    onSetRating(x)
    // console.log(x, "inisde star comp")
    }
    // console.log(hoveredRating)

    return (
        <div style={containerStyle}>
            <div style={starContainerStyle}>
                {Array.from({ length: maxRating }, (_, i) => {
                    const num = i + 1;
                  return  <Star key={i}
                        onClick={() => handleRating(num)} 
                      full={hoveredRating ? hoveredRating >= num : rating >= num}
                      onMouseEnter={()=>handleMouseEnter(num)}
                      onMouseLeave={()=>handleMouseLeave(num)} 
                      hoveredValue={hoveredRating >=num}
                      fill={fill}
                      />
                })}
            </div>
            <p style={{lineHeight : "1", margin: 0}}>{
                message.length === maxRating ? message[hoveredRating ? hoveredRating - 1 : rating - 1] : hoveredRating || rating}</p>
        </div>
    );
}


const starStyle = {
    display: "block",
    cursor: "pointer"
}

function Star({ onClick, full, onMouseEnter, onMouseLeave, fill }) {
    return (
        <span role="button" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={starStyle} onClick={onClick}>
            {full ?(
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill={fill}
                    stroke="red"
                    width={24}
                    height={24}
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    stroke="black"
                    strokeWidth={2}
                    width={24}
                    height={24}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            )}
        </span>
    );
}