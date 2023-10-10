import { Route, Routes, useSearchParams } from "react-router-dom";
import NavBar from './components/NavBar'
import './styles/header-styles.css';
import Dashboard from './components/Dashboard';
import './styles/dashboard-style.css';
import TenantManagement from './components/TenantManagement';
import './styles/tenant-management-style.css'
import PaymentManagement from './components/PaymentManagement';
import './styles/payment-management-style.css';
import RoomManagement from './components/RoomManagement';
import './styles/room-management-style.css'
import Login from "./components/Login";
import './styles/login-style.css'
import { useState } from "react";

function App() {
  let [isAuthorized, setIsAuthorized] = useState(false);
  // let [isAuthorized, setIsAuthorized] = useState(true);
  function updateAuth(status) {
    setIsAuthorized(status);
  }
  if (isAuthorized) {
    return (
      <>
        <NavBar updateAuth={updateAuth}></NavBar>
        <Routes>
          <Route path="/" element={<Dashboard></Dashboard>}></Route>
          <Route path="/rooms" element={<RoomManagement></RoomManagement>}></Route>
          <Route path="/tenants" element={<TenantManagement></TenantManagement>}></Route>
          <Route path="/payments" element={<PaymentManagement></PaymentManagement>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
        </Routes>
      </>)
  }
  return (
    <>
      <Login updateAuth={updateAuth}></Login>
      {/* <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<Dashboard></Dashboard>}></Route>
        <Route path="/rooms" element={<RoomManagement></RoomManagement>}></Route>
        <Route path="/tenants" element={<TenantManagement></TenantManagement>}></Route>
        <Route path="/payments" element={<PaymentManagement></PaymentManagement>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
      </Routes> */}
    </>
  )
}

export default App
