import logo from './logo.svg';
import './App.css';
import DynamicTable from './Component/generator';
import { Routes, Route } from "react-router-dom";

function App() {
  return (   
    <Routes>
      <Route exact path="/test" element={<DynamicTable />} />
    </Routes>
  );
}

export default App;
