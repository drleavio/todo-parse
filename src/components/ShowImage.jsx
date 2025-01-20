import React, { useEffect, useRef } from "react";

const ShowImage = ({ image, setShowImg,setPic,setImgId }) => {
  const componentRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        componentRef.current=null
        setShowImg(false);
        setPic(null);
        setImgId(null);
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
        position: "fixed",
        top: "20px",
        left:"100px",
        backgroundColor: "lightgray",
        height: "300px",
        width: "300px",
        zIndex:"10"
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
