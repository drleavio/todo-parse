import React, { useContext } from "react";
import { Context } from "./../context/useContext";
import day from "../assets/images/day.svg";
import night from "../assets/images/night.svg";

const Header = () => {
  const { theme, toggle } = useContext(Context);
  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-between btm-border"
      style={
        theme === "dark"
          ? { backgroundColor: "white", color: "black" }
          : { backgroundColor: "black", color: "white" }
      }
    >
      <div className="w-100 d-flex align-items-center justify-content-center py-2 fw-light fs-2">
        Todo
      </div>
      <div className="right_container w-100 py-2 d-flex align-items-center justify-content-center">
        <ul className="right_container_ul d-flex align-items-center justify-content-center gap-3 fw-light ">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
          {theme === "dark" ? (
            <li onClick={() => toggle()}>
              <img src={night} alt="" />
            </li>
          ) : (
            <li onClick={() => toggle()}>
              <img src={day} alt="" />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
