import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
      method: "POST",
      headers: {
        "CONTENT-TYPE": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    if (response.ok) {
      navigate("/LogIn");
    } else {
      window.alert("please try again");
      setName("");
      setEmail("");
      setPassword("");
    }
  };
  return (
    <>
      <h1 className="title">PLEASE GIVE US YOUR DETAILS. </h1>
      <form className="main-container" method="POST" onSubmit={handleSubmit}>
        <label htmlFor="name" className="title">
          Name
        </label>
        <input
          id="name"
          required
          className="list-item-input"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email" className="title">
          Email
        </label>
        <input
          id="email"
          required
          className="list-item-input"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password" className="title">
          Password
        </label>
        <input
          id="password"
          required
          className="list-item-input"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">SignUp</button>
      </form>
    </>
  );
};

export default SignUpPage;
