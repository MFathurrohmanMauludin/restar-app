import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" Component={Home}></Route>
        <Route path="/start-chat" Component={Chat}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
