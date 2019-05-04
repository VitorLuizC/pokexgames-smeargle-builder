import "./SortableTable.scss";
import React, { useState, useEffect } from "react";
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
  const [page, setPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  const pages = Math.ceil(rows.length / resultsPerPage);

  useEffect(() => {
    setPage(0);
  }, [rows]);

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
    setPage(0);
    setSorter(sortment === Sortment.DESCENDING ? undefined : col);
    setSortment(
      {
        [Sortment.NONE]: Sortment.ASCENDING,
        [Sortment.ASCENDING]: Sortment.DESCENDING,
        [Sortment.DESCENDING]: Sortment.NONE
      }[sortment]
    );
  };

  const paginateRows = rows =>
    rows.slice(resultsPerPage * page, resultsPerPage * page + resultsPerPage);

  const isFirst = page === 0;
  const isLast = page === pages - 1;

  return (
    <>
      <table className="sortable-table">
        <thead className="header">
          <tr className="row">
            {cols.map((col, index) => {
              const isSorting = sorter === col;
              const classNames = `cell ${
                isSorting ? "-sorting" : "-unsorting"
              }`;
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
          {paginateRows(sortRows(rows)).map((row, index) => (
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

      <div className="pagination">
        <div className="results">
          <label className="label">Results per page</label>

          <select
            value={resultsPerPage}
            className="field"
            onChange={event => {
              const value = +event.target.value;
              setPage(0);
              setResultsPerPage(value);
            }}
          >
            {[10, 25, 50, 100].map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="controls">
          <button
            className="button"
            disabled={isFirst}
            onClick={() => setPage(0)}
          >
            First
          </button>
          <button
            className="button"
            disabled={isFirst}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <p className="current">
            {page + 1} / {pages}
          </p>
          <button
            className="button"
            disabled={isLast}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
          <button
            className="button"
            disabled={isLast}
            onClick={() => setPage(pages - 1)}
          >
            Last
          </button>
        </div>
      </div>
    </>
  );
}

export default SortableTable;
