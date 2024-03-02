import "./App.css";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import {
  ChevronDoubleLeft,
  ChevronDoubleRight,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";

const App = () => {
  const [allItems, setAllItems] = useState(),
    [currentItems, setCurrentItems] = useState(),
    [currentPage, setCurrentPage] = useState(1),
    [status, setStatus] = useState("loading"),
    [filterType, setFilterType] = useState("product"),
    [filter, setFilter] = useState();

  const timestamp = new Date().toISOString().slice(0, 10).split("-").join(""),
    data = `Valantis_${timestamp}`,
    authorizationString = CryptoJS.MD5(data).toString();

  let itemsPerPage = 50,
    lastIndex = currentPage * itemsPerPage,
    firstIndex = lastIndex - itemsPerPage,
    numberOfButtons = allItems && Math.floor(allItems.length / itemsPerPage),
    items = allItems && allItems.slice(firstIndex, lastIndex);

  let buttons = pagination(currentPage, numberOfButtons).map((el, index) => (
    <button
      className="btn btn-light me-1"
      key={index}
      onClick={() => {
        if (el !== "...") setCurrentPage(el);
      }}
    >
      {el}
    </button>
  ));

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

  useEffect(() => {
    if (filter && filter.length) {
      request(
        {
          action: "filter",
          params: {
            [filterType]: filterType === "price" ? parseInt(filter) : filter,
          },
        },
        setAllItems
      );
    }

    if (filter === "") {
      request(
        {
          action: "get_ids",
        },
        setAllItems
      );
    }
  }, [filter]);

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
      if (i === 1 || i === last || (i >= left && i < right)) {
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
      .then((res) => {
        if (res.status !== 200) {
          request(body, callback);
          console.log(res.status)
        }
        return res.json();
      })
      .then((data) => {
        if (data.result && data.result.length)
          callback(
            data.result.filter(
              (item, index) => data.result.indexOf(item) === index
            )
          );

        setStatus("fulfiled");
      })
      .catch((error) => setStatus("rejected"));
  }

  return (
    <div className="App">
      {
        <form
          onSubmit={(e) => e.preventDefault()}
          className="d-flex align-items-center px-4 py-2 mx-auto"
        >
          <select
            value={filterType}
            name="filter"
            onChange={(e) => setFilterType(e.target.value)}
            className="form-select"
            key='1'
          >
            <option value="product">Название</option>
            <option value="price">Цена</option>
            <option value="brand">Бренд</option>
          </select>
          <input
            type="text"
            name="price"
            placeholder="Фильтр"
            value={filter}
            key='2'
            onChange={(e) => setFilter(e.target.value)}
            className="form-control"
          />
        </form>
      }
      <div className="d-flex justify-content-center p-4 gap-3 flex-wrap">
        {status === "loading" && (
          <h2 style={{ position: "absolute", top: "40%" }}>
            Загрузка данных ...
          </h2>
        )}

        {currentItems &&
          currentItems
            .filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i)
            .map((item, index) => (
              <div className="card" key={`div${index}`}>
                <h6 className="card-title" key={`title${index}`}>{item.brand}</h6>
                <p className="card-text" key={`text${index}`}>{item.product}</p>
                <h6 className="card-subtitle mb-2 text-body-secondary" key={`h6${index}`}>
                  id: {item.id}
                </h6>
                <p className="card-text" key={`p${index}`}>Цена: {item.price} руб.</p>
              </div>
            ))}
      </div>
      {status === "fulfiled" && allItems && allItems.length > 50 && (
        <div className="py-3">
          <button
            className="btn btn-light me-1"
            onClick={() => setCurrentPage(1)}
          >
            <ChevronDoubleLeft />
          </button>
          <button
            className="btn btn-light me-1"
            onClick={() => {
              if (currentPage !== 1) setCurrentPage(currentPage - 1);
            }}
          >
            <ChevronLeft />
          </button>

          {buttons}

          <button
            className="btn btn-light me-1"
            onClick={() => {
              if (currentPage !== numberOfButtons)
                setCurrentPage(currentPage + 1);
            }}
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
