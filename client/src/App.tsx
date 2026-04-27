import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import WebsiteContent from "./pages/WebsiteContent"
import NodeProvider from "./context/DataContext"

const App = () => {
  return (
    <NodeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<WebsiteContent />} />
      </Routes>
    </NodeProvider>
  )
}

export default App