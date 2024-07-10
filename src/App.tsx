import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth } from "./pages/auth/auth.tsx";
import { Login } from "./pages/login/login.tsx";
import { HomePage } from "./pages/homePage/homePage.tsx";
import { ForgotPassword } from "./pages/forgotPassword/forgotPassword.tsx";
import { AuthProvider } from "./contexts/authContext.tsx";
import { ViewHabits } from "./pages/viewHabits/viewHabits.tsx";
import { Habit } from "./components/Habit/Habit.tsx";
import { CompletedHabits } from "./pages/completedHabits/completedHabits.tsx";

function App() {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/habits" element={<ViewHabits />}>
              <Route path=":habitName" element={<Habit />} />
            </Route>
            <Route path="/finished-habits" element={<CompletedHabits />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
