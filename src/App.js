import "./App.css";
import CryptoJS from "crypto-js";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setState, changePage } from "./store/slice";

const App = () => {
  const state = useSelector((state) => state.state);

  const dispatch = useDispatch();

  const obj = {
    action: "get_ids",
  };

  const password = "Valantis";
  const timestamp = new Date().toISOString().slice(0, 10).split("-").join("");

  const data = `${password}_${timestamp}`;
  const authorizationString = CryptoJS.MD5(data).toString();

  async function getData() {
    const response = await fetch("https://api.valantis.store:41000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": authorizationString,
      },
      body: JSON.stringify(obj),
    }).then((res) => res.json());

    return response;
  }

  async function getItemData(item) {
    const response = await fetch("https://api.valantis.store:41000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": authorizationString,
      },
      body: JSON.stringify({
        action: "get_items",
        params: { ids: [item] },
      }),
    }).then((res) => res.json());

    return response;
  }

  async function qwe() {
    let items = await getData();

    dispatch(setState(items.result));

    /*
    const qwe = items.result.forEach((element) => {
      getItemData(element);
    });
    */

    //let a = await getItemData(items.result[0]);

    //dispatch(setState(a.result));
  }

  useEffect(() => {
    qwe();
  }, []);

  let lastItemIndex = state.currentPage * state.itemPerPage;
  let firstItemIndex = lastItemIndex - state.itemPerPage;
  const currentItems = state.value.slice(firstItemIndex, lastItemIndex);
  const numberOfButtons = Math.floor(state.value.length / state.itemPerPage);

  const buttons = Array.from({ length: numberOfButtons }, (_, index) => {
    return (
      <button onClick={() => dispatch(changePage(index + 1))} key={index}>
        {index + 1}
      </button>
    );
  });

  return (
    <div className="App">
      <header className="App-header">
        <div>{state.value && currentItems.map((el) => el)}</div>
        <div>{buttons}</div>
      </header>
    </div>
  );
};

export default App;
