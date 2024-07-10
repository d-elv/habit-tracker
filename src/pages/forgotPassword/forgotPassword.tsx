import "../login/login.css";
import "../auth/auth.css";
import "./forgotPassword.css";
import { ChangeEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export const ForgotPassword = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailRef.current !== null) {
      const email = emailRef.current.value;
      try {
        setMessage("");
        setError("");
        setLoading(true);
        await resetPassword(email);
        setMessage(
          "If you've already signed up. Check your email inbox for further instructions"
        );
      } catch {
        setError("Failed to reset password");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div className="sign-up-container">
        <h2 className="header">Password Reset</h2>
        {error && <h1 className="error-message">{error}</h1>}
        {message && <h1 className="success-message">{message}</h1>}
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
          <button disabled={loading} type="submit" className="sign-up-button">
            Reset Password
          </button>
        </form>
        <div>
          <Link to="/login">
            <p className="forgot-password-link">Log In</p>
          </Link>
        </div>
      </div>
      <p className="sign-up-line">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </>
  );
};
