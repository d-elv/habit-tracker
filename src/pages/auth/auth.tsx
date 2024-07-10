import { FC, useRef, ChangeEvent, useState } from "react";
import "./auth.css";
import { useAuth } from "../../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";

export const Auth: FC = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      emailRef.current !== null &&
      passwordRef.current !== null &&
      passwordConfirmRef.current !== null
    ) {
      const email: string = emailRef.current.value;
      const password: string = passwordRef.current.value;
      const passwordConfirm: string = passwordConfirmRef.current.value;
      if (password !== passwordConfirm) {
        return setError("Passwords do not match");
      }
      try {
        setError("");
        setLoading(true);
        await signup(email, password);
        navigate("/");
      } catch {
        setError("Failed to create an account");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div className="sign-up-container">
        <h2 className="header">Sign Up</h2>
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
          <div className="label-and-field">
            <label htmlFor="password">Password Confirmation</label>
            <input
              className="sign-in-field"
              type="password"
              name="password-confirm"
              placeholder="Confirm password here..."
              id="password-confirm"
              ref={passwordConfirmRef}
              required
            />
          </div>
          <button disabled={loading} type="submit" className="sign-up-button">
            Sign Up
          </button>
        </form>
      </div>
      <p className="log-in-line">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </>
  );
};
