import "./PokemonName.scss";
import React from "react";

export default function PokemonName({ icon, link, name }) {
  const title = "Icon for " + name;

  return (
    <a
      rel="noopener noreferrer"
      href={link}
      target="_blank"
      className="pokemon-name"
    >
      <figure className="icon">
        <img className="image" src={icon} alt={name} title={title} />
      </figure>

      <span className="name">{name}</span>
    </a>
  );
}
