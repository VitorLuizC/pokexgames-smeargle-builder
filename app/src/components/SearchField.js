import "./SearchField.scss";
import React from "react";
import Loupe from "../assets/icons/Loupe.svg";

export default function SearchField({ value, placeholder, onChange }) {
  const id = "id-" + Date.now();

  return (
    <form className="search-field" onSubmit={event => event.preventDefault()}>
      <label className="label" htmlFor={id}>
        <img className="icon" src={Loupe} alt="Search" title="Loupe icon." />
      </label>

      <input
        id={id}
        type="search"
        value={value}
        className="field"
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
    </form>
  );
}
