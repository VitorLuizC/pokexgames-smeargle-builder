import React, { useState } from "react";

const Sortment = Object.freeze({
  NONE: 0,
  ASCENDING: 1,
  DESCENDING: 2
});

/**
 * @param {T} value
 * @returns {T}
 * @template T
 */
function identity(value) {
  return value;
}

function Table({ rows, cols }) {
  const [sorter, setSorter] = useState(undefined);
  const [sortment, setSortment] = useState(Sortment.NONE);

  const sortRows = rows => {
    if (sortment === Sortment.NONE) {
      return rows;
    }

    const compare =
      sorter.sort ||
      ((rowA, rowB) => {
        const valueA = (sorter.value || identity)(rowA);
        const valueB = (sorter.value || identity)(rowB);

        if (typeof valueA === "string" || typeof valueB === "string")
          return String(valueA).localeCompare(String(valueB));
        if (typeof valueA === "number" || typeof valueB === "number")
          return Number(valueA) - Number(valueB);
        return 0;
      });

    if (sortment === Sortment.ASCENDING) {
      return [...rows].sort(compare);
    }

    if (sortment === Sortment.DESCENDING) {
      return [...rows].sort(compare).reverse();
    }
  };

  return (
    <table>
      <thead>
        <tr>
          {cols.map((col, index) => (
            <th
              key={index}
              onClick={() => {
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
              }}
            >
              <span>{col.label}</span>
              {sorter === col && sortment !== Sortment.NONE && (
                <span>{sortment === Sortment.ASCENDING ? "▲" : "▼"}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {sortRows(rows).map((row, index) => (
          <tr key={index}>
            {cols.map((col, index) => {
              if (col.render) return col.render({ row, index });
              if (col.value)
                return <td key={index}>{col.value(row, index)}</td>;
              return <td key={index}>{identity(row)}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
