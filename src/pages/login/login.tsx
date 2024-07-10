import "./login.css";
import "../auth/auth.css";
import { ChangeEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export const Login = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailRef.current !== null && passwordRef.current !== null) {
      const email: string = emailRef.current.value;
      const password: string = passwordRef.current.value;

      try {
        setError("");
        setLoading(true);
        await login(email, password);
        navigate("/");
      } catch {
        setError("Failed to sign in");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div className="sign-up-container">
        <h2 className="header">Log In</h2>
        {error && <h1 className="error-message">{error}</h1>}
        <form className="sign-in-form" onSubmit={handleSubmit}>
          <div className="label-and-field">
            <label htmlFor="email">Email</label>
            <input
              className="sign-in-field"
              type="email"
              name="email"
              placeholder="example@hotmail.com"
              id="email"
              ref={emailRef}
              required
            />
          </div>
          <div className="label-and-field">
            <label htmlFor="password">Password</label>
            <input
              className="sign-in-field"
              type="password"
              name="password"
              placeholder="Password here..."
              id="password"
              ref={passwordRef}
              required
            />
          </div>
          <button disabled={loading} type="submit" className="sign-up-button">
            Log In
          </button>
        </form>
        <div>
          <Link to="/forgot-password">
            <p className="forgot-password-link">Forgot Password?</p>
          </Link>
        </div>
      </div>
      <p className="sign-up-line">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </>
  );
};
