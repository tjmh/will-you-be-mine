import { useState } from "react";
import HomeView from "./views/Home.jsx";
import AgreedView from "./views/Agreed.jsx";
import "./App.css";

function App() {
  const [agreed, setAgreed] = useState(false)

  return (
    <>
      {agreed ? <AgreedView /> : <HomeView setAgreed={setAgreed} />}
    </>
  )
}

export default App;
