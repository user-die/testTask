import "./App.css";
import CryptoJS from "crypto-js";
import uniqueId from "lodash.uniqueid";
import { useEffect, useState } from "react";
import {
  ChevronDoubleLeft,
  ChevronDoubleRight,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";

// Фильтрация

const App = () => {
  const [allItems, setAllItems] = useState(),
    [currentItems, setCurrentItems] = useState(),
    [currentPage, setCurrentPage] = useState(1),
    [status, setStatus] = useState("loading"),
    [filterType, setFilterType] = useState(),
    [filter, setFilter] = useState();

  const timestamp = new Date().toISOString().slice(0, 10).split("-").join(""),
    data = `Valantis_${timestamp}`,
    authorizationString = CryptoJS.MD5(data).toString();

  let itemsPerPage = 50,
    lastIndex = currentPage * itemsPerPage,
    firstIndex = lastIndex - itemsPerPage,
    numberOfButtons = allItems && Math.floor(allItems.length / itemsPerPage),
    items = allItems && allItems.slice(firstIndex, lastIndex);

  useEffect(() => {
    request(
      {
        action: "get_ids",
      },
      setAllItems
    );
  }, []);

  useEffect(() => {
    if (allItems && allItems.length) {
      setStatus("loading");
      setCurrentItems([]);
      request(
        {
          action: "get_items",
          params: {
            ids: items,
          },
        },
        setCurrentItems
      );
    }
  }, [allItems, currentPage]);

  // product, price, brand

  useEffect(() => {
    request(
      {
        action: "filter",
        params: { product: filter },
      },
      setAllItems
    );
  }, [filterType]);

  function pagination(c, m) {
    var current = c,
      last = m,
      delta = 2,
      left = current - delta,
      right = current + delta + 1,
      range = [],
      rangeWithDots = [],
      l;

    for (let i = 1; i <= last; i++) {
      if (i == 1 || i == last || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  function request(body, callback) {
    fetch("https://api.valantis.store:41000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": authorizationString,
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        callback(data.result);
        setStatus("fulfiled");
      });
  }

  let buttons = pagination(currentPage, numberOfButtons).map((el) => (
    <button
      className="btn btn-light"
      key={uniqueId()}
      onClick={() => {
        if (el !== "...") setCurrentPage(el);
      }}
    >
      {el}
    </button>
  ));

  return (
    <div className="App">
      {status === "fulfiled" && (
        <form onSubmit={(e) => e.preventDefault()}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="price">Цена</option>
            <option value="brand">Бренд</option>
            <option value="title">Название</option>
          </select>
          <input
            type="text"
            name="price"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          ></input>
        </form>
      )}
      <div className="flex-block">
        {status === "loading" && (
          <h2 style={{ position: "absolute", top: "40%" }}>
            Загрузка данных ...
          </h2>
        )}

        {status === "rejected" && (
          <h2 style={{ position: "absolute", top: "40%" }}>
            Ошибка загрузки данных. Обновите страницу
          </h2>
        )}

        {currentItems &&
          currentItems.map((item) => (
            <div className="card">
              <h6 className="card-title">{item.brand}</h6>

              <p className="card-text">{item.product}</p>
              <h6 className="card-subtitle mb-2 text-body-secondary">
                {item.id}
              </h6>
              <p className="card-text">{`${item.price} руб.`}</p>
            </div>
          ))}
      </div>
      {status === "fulfiled" && (
        <div>
          <button className="btn btn-light" onClick={() => setCurrentPage(1)}>
            <ChevronDoubleLeft />
          </button>
          <button
            className="btn btn-light"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft />
          </button>

          {buttons}

          <button
            className="btn btn-light"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight />
          </button>
          <button
            className="btn btn-light"
            onClick={() => setCurrentPage(numberOfButtons)}
          >
            <ChevronDoubleRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
