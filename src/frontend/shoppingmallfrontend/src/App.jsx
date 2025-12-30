import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GlobalStyles from './styles/GlobalStyles.jsx';
import HomePage from './pages/HomePage.jsx';
import '../App.css';
import LoginPage from "./pages/LoginPage.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProductsPage from "./pages/cartandproduct/ProductsPage.jsx";
import CartPage from "./pages/cartandproduct/CartPage.jsx";
import CheckoutPage from "./pages/cartandproduct/CheckoutPage.jsx";
import ProductDetailPage from "./pages/cartandproduct/ProductDetailPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import ProfileRedirect from "./pages/profile/ProfileRedirect.jsx";
import OrdersPage from "./pages/orders/OrdersPage.jsx";
import SettingsPage from "./pages/settings/SettingsPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {

  return (
      <Router>
          <GlobalStyles />
          <div className={"app-container"}>
              <Navbar/>
              <main className={"main-content"}>
                  <Routes>
                      <Route path = "/" element = {<HomePage />}/>
                      <Route path = "/login" element = {<LoginPage/>}/>
                      <Route path = "/register" element = {<RegisterPage/>}/>
                      <Route path = "/products" element = {<ProductsPage/>}/>
                      <Route path = "/cart" element = {<CartPage/>}/>
                      <Route path = "/checkout" element = {<CheckoutPage/>}/>
                      <Route path = "/products/:productId" element = {<ProductDetailPage/>}/>
                      <Route path = "/profile" element = {<ProfileRedirect/>}/>
                      <Route path = "/profile/:userId" element = {<ProfilePage/>}/>
                      <Route path = "/orders" element={<ProtectedRoute><OrdersPage/></ProtectedRoute>}/>
                      <Route path = "/profile/:userId/settingspage" element = {<ProtectedRoute><SettingsPage/></ProtectedRoute>}/>
                  </Routes>
              </main>
          </div>
      </Router>
  );
}

export default App;

