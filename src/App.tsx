import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CampaignDetail from "./pages/CampaignDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
