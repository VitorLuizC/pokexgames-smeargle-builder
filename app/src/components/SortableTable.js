import "./SortableTable.scss";
import React, { useState } from "react";
import identity from "../helpers/identity";

const Sortment = Object.freeze({
  NONE: 0,
  ASCENDING: 1,
  DESCENDING: 2
});

/**
 * Resolves compare function from sorter column.
 * @param {TableCol<T>} col
 * @returns {(rowA: T, rowB: T) => number}
 * @template T
 */
function resolveCompare({ sort, value = identity } = {}) {
  if (typeof sort === "function") {
    return sort;
  }

  return (rowA, rowB) => {
    const valueA = value(rowA),
      valueB = value(rowB);

    if (typeof valueA === "string" || typeof valueB === "string")
      return String(valueA).localeCompare(String(valueB));
    if (typeof valueA === "number" || typeof valueB === "number")
      return Number(valueA) - Number(valueB);
    return 0;
  };
}

function SortableTable({ rows, cols }) {
  const [sorter, setSorter] = useState(undefined);
  const [sortment, setSortment] = useState(Sortment.NONE);

  const sortRows = rows => {
    if (sortment === Sortment.NONE) {
      return rows;
    }

    const compare = resolveCompare(sorter);

    if (sortment === Sortment.ASCENDING) {
      return [...rows].sort(compare);
    }

    if (sortment === Sortment.DESCENDING) {
      return [...rows].sort(compare).reverse();
    }
  };

  const onChangeFor = col => () => {
    if (col !== sorter || sortment === Sortment.NONE) {
      setSorter(col);
      setSortment(Sortment.ASCENDING);
      return;
    }

    if (sortment === Sortment.ASCENDING) {
      setSortment(Sortment.DESCENDING);
      return;
    }

    if (sortment === Sortment.DESCENDING) {
      setSorter(undefined);
      setSortment(Sortment.NONE);
      return;
    }

    throw new Error(
      "Unexpected `sorter` or `sortment` on `onChange` callback."
    );
  };

  return (
    <table className="sortable-table">
      <thead className="header">
        <tr className="row">
          {cols.map((col, index) => {
            const isSorting = sorter === col;
            const classNames = `cell ${isSorting ? "-sorting" : "-unsorting"}`;
            return (
              <th
                key={index}
                className={classNames}
                onClick={onChangeFor(col)}
                style={{ textAlign: col.align || "left" }}
              >
                <span className="label">{col.label}</span>

                <span className="arrow">
                  {isSorting && sortment === Sortment.ASCENDING ? "▲" : "▼"}
                </span>
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody className="content">
        {sortRows(rows).map((row, index) => (
          <tr className="row" key={index}>
            {cols.map((col, index) => {
              const { render, value = identity, align = "left" } = col || {};

              return (
                <td key={index} style={{ textAlign: align }} className="cell">
                  {render ? render({ row, index }) : value(row)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SortableTable;
