import React, { useEffect, useRef } from "react";

const ShowImage = ({ image, setShow }) => {
  const componentRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      ref={componentRef}
      className="d-flex align-items-center justify-content-center rounded"
      style={{
        position: "absolute",
        top: "100px",
        backgroundColor: "lightgray",
        height: "400px",
        width: "400px",
        zIndex:"2"
      }}
    >
      <img
        className="d-flex align-items-center justify-content-center"
        src={image}
        alt="preview"
        style={{ height: "200px", width: "200px" }}
      />
    </div>
  );
};

export default ShowImage;
