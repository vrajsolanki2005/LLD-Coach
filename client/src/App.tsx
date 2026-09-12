import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProblemCard/ProtectedRoute";
import PracticeWorkspace from "./pages/PracticeWorkspace";
import Problems from "./pages/Problems";
import ProblemDetails from "./pages/ProblemDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EvaluationResult from "./pages/EvaluationResult";
import AttemptHistory from "./pages/AttemptHistory";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Problems />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/attempts/:id/result" element={<EvaluationResult />} />
          <Route path="/attempts" element={<AttemptHistory />} />
          <Route path="/attempts/:id" element={<PracticeWorkspace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
