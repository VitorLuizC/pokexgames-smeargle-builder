import "./PokemonIcon.scss";
import React from "react";

export default function PokemonIcon({ name, icon }) {
  return (
    <figure className="PokemonIcon">
      <img
        className="PokemonIcon__image"
        src={icon}
        alt={name}
        title={"Icon for " + name}
      />
    </figure>
  );
}
