import "./css/BigInput.css";
import React from "react";

type BigInputProps = {
    placeHolder: string,
	id: string,
	type?: string,
};

const BigInput: React.FC<BigInputProps> = ({ placeHolder, id, type }) => (
    <>
        <input className={'big-input'} id={id} type={type} placeholder={placeHolder} />
    </>
);

export default BigInput;