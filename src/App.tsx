import "./App.css";
import { FiltersBar } from "./components/FiltersBar";
import { OrdersList } from "./components/OrdersList";
import { OrderDetails } from "./components/OrderDetails";

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>Orders Workspace</h1>
      </header>

      <FiltersBar />

      <main className="app__main">
        <OrdersList />
        <OrderDetails />
      </main>
    </div>
  );
}

export default App;
