import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DesktopSignIn from "./pages/DesktopSignIn";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/desktopSignIn" element={<DesktopSignIn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
