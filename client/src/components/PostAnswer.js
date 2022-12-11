import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PostAnswer = () => {
  const [question, setQuestion] = useState({});

  const { questionId } = useParams();

  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("x-auth-token");
  useEffect(()=>{ if (!token) {
    navigate(`/LogIn`);
  }},[])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetching the answers list
        const result = await fetch(
          `${process.env.REACT_APP_API_URL}/answers/${questionId}`,
          {
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );

        // fetch error handling
        if (result.status === 422) {
          localStorage.clear();
          navigate(`/LogIn`);
        }
        if (result.ok === false) {
          setError(true);
          return;
        }
        const data = await result.json();
        setQuestion(data[0]);
        setIsLoading(false);
        return;
      } catch (error) {
        setError(true);
        console.log("Error fetching products");
      }
    };
    fetchData();
  }, [questionId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // fetching the post route
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/postanswer/${questionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ description: answer }),
        }
      );

      // fetch error handling
      if (response.status === 422) {
        localStorage.clear();
        navigate(`/LogIn`);
      }
      if (!response.ok) {
        console.log("Fetch not ok");
        setError(true);
        return;
      } else {
        setIsLoading(false);
        navigate(`/answers/${questionId}`);
      }
    } catch {
      setError(true);
    }
  };

  // error message if API isn't running or fetch is invalid
  if (error) {
    return <p className="list-item">Oops, something went wrong!</p>;
  }

  return (
    <>
      <h1 className="title">Post Answer</h1>
      <p className="title">{question.questiondescription}</p>

      {/* query form for the user to enter their answer to a question */}
      <form onSubmit={handleSubmit} className="main-container">
        <input
          placeholder="Enter your answer..."
          type="text"
          required
          id="answer-description"
          name="answer-description"
          className="list-item1"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
          }}
        />
        <button className="navbtn" disabled={isLoading}>
          Submit
        </button>
      </form>
    </>
  );
};

export default PostAnswer;
