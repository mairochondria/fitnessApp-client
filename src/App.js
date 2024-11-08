import "./App.css";
import { useState, useEffect } from "react";
import { UserProvider } from "./context/UserContext";
import { Container } from "react-bootstrap";
import AppNavBar from "./components/AppNavBar";
import WorkoutsPage from "./pages/WorkoutsPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Error from "./pages/Error"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  function unsetUser() {
    localStorage.clear();
  }

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user]);

  useEffect(() => {

        if(localStorage.getItem("token") !== null) {

            fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setUser({
                    id: data._id,
                    isAdmin: data.isAdmin
                })
            })
            
        } else {

            setUser({
                id: null,
                isAdmin: null
            })
        }
    }, [])

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
    <Router>
      <AppNavBar />
      <Container>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout/>} />
          <Route path="*" element={<Error />} />
        </Routes>

      </Container>
    </Router>
    </UserProvider>
  );
}

export default App;
