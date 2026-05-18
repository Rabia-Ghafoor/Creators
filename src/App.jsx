import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShowCreators from "./pages/ShowCreators";
import ViewCreator from "./pages/ViewCreator";
import AddCreator from "./pages/AddCreator";
import EditCreator from "./pages/EditCreator";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowCreators />} />
        <Route path="/creators/new" element={<AddCreator />} />
        <Route path="/creators/:id" element={<ViewCreator />} />
        <Route path="/creators/:id/edit" element={<EditCreator />} />
      </Routes>
    </BrowserRouter>
  );
}
