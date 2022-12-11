import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import styles from "./LoginPage.module.css";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  localStorage.clear();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/users?email=${email}&password=${password}`
    );
    if (response.status === 404) {
      alert("Email not Found, please sign up!");
      navigate("/SignUp");
      return;
    }

    const user = await response.json();
    if (!user.token) {
      alert("Wrong Password");
      navigate("/LogIn");
      return;
    } else {
      localStorage.setItem("x-auth-token", JSON.stringify(user.token));
      localStorage.setItem("user", JSON.stringify(user.user));
      navigate("/");
    }
  };
  return (
    <>
      <form className="main-container" method="POST" onSubmit={handleSubmit}>
        <h1 className="title">PLEASE LOG IN</h1>
        <label htmlFor="email" className="title">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          className="list-item-input"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password" className="title">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          className="list-item-input"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="title" type="submit">
          Log In
        </button>
      </form>
    </>
  );
};
export default LoginPage;
