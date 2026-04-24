import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import WebsiteContent from "./pages/WebsiteContent"


const App = () => {


  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<WebsiteContent />} />
      </Routes>
    </>
  )
}

export default App