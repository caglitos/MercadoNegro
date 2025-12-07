import "./css/BigButton.css";

import React from "react";

interface BigButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  className?: string;
}

const BigButton: React.FC<BigButtonProps> = ({ onClick, children, className }) => {
  return (
    <button className={`big-button ${className}`} /*+ className*/ onClick={onClick}>
      {children}
    </button>
  );
}

export default BigButton;