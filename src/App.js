import "./App.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changePage, fetchAllitems, fetchCurrentItems } from "./store/slice";
import CryptoJS from "crypto-js";

const App = () => {
  const [allItems, setAllItems] = useState();
  const [currentItems, setCurrentItems] = useState();

  const timestamp = new Date().toISOString().slice(0, 10).split("-").join(""),
    data = `Valantis_${timestamp}`,
    authorizationString = CryptoJS.MD5(data).toString();

  useEffect(() => {
    fetch("https://api.valantis.store:41000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": authorizationString,
      },
      body: JSON.stringify({
        action: "get_ids",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAllItems(data.result);
      });
  }, []);

  useEffect(() => {
    if (allItems && allItems.length) {
      fetch("https://api.valantis.store:41000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": authorizationString,
        },
        body: JSON.stringify({
          action: "get_items",
          params: {
            ids: allItems.slice(0, 50),
          },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setCurrentItems(data.result);
        });
    }
  }, [allItems]);

  console.log(currentItems);

  return (
    <div className="App">
      <header className="App-header">
        {currentItems &&
          currentItems.map((item) => (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.brand}</h5>
                <h6 className="card-subtitle mb-2 text-body-secondary">
                  {item.id}
                </h6>
                <p className="card-text">{item.price}</p>
              </div>
            </div>
          ))}
      </header>
    </div>
  );
};

export default App;
