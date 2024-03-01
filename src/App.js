import "./App.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changePage, fetchAllitems, fetchCurrentItems } from "./store/slice";

const App = () => {
  const state = useSelector((state) => state.state);
  console.log(state);
  const dispatch = useDispatch();

  const [qwe, setQwe] = useState();

  let lastItemIndex = state.currentPage * state.itemPerPage,
    firstItemIndex = lastItemIndex - state.itemPerPage,
    currentItems = state.allItems.slice(firstItemIndex, lastItemIndex);
  const numberOfButtons = Math.floor(8000 / 50);

  /*
  useEffect(() => {
    dispatch(fetchAllitems());
  }, [dispatch]);
  */

  useEffect(() => {
    async function qwe() {
      let data = await dispatch(fetchAllitems());

      let lastItemIndex = state.currentPage * state.itemPerPage,
        firstItemIndex = lastItemIndex - state.itemPerPage;

      await dispatch(
        fetchCurrentItems(data.payload.slice(firstItemIndex, lastItemIndex))
      );
    }

    qwe();
  }, []);

  const buttons = Array.from({ length: numberOfButtons }, (_, index) => {
    return (
      <button
        className="btn btn-light"
        onClick={() => dispatch(changePage(index + 1))}
        key={index}
      >
        {index + 1}
      </button>
    );
  });

  // {currentItems && currentItems.map((el) => el)}

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {state.currentItems &&
            state.currentItems.map((item) => {
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{item.brand}</h5>
                  <h6 className="card-subtitle mb-2 text-body-secondary">
                    {item.id}
                  </h6>
                  <p className="card-text">{item.price}</p>
                </div>
              </div>;
            })}

          {state.status === "loading" && <h2>Загрузка ...</h2>}
          {state.error && <h2>{state.error}</h2>}
        </div>

        <div>{buttons}</div>
      </header>
    </div>
  );
};

export default App;
