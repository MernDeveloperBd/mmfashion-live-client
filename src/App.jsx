import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Shop from "./pages/Shop/Shop"
import Card from "./pages/Card/Card"
import Details from "./pages/Details/Details"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Shipping from "./pages/Shipping"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { get_category } from "./store/Reducers/homeReducer"

function App() {
 const dispatch = useDispatch()
  useEffect(() => {
    dispatch(get_category())
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/card" element={<Card />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/details/:slug" element={<Details />} />
        <Route path="/shipping" element={<Shipping />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
