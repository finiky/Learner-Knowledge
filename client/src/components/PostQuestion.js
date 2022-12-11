import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PostQuestion = () => {
  const { topicId } = useParams();
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("x-auth-token");
  useEffect(()=>{ if (!token) {
    navigate(`/LogIn`);
  }},[])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(
          `${process.env.REACT_APP_API_URL}/questions/${topicId}`,
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
        setTopic(data[0]);
        setIsLoading(false);
        return;
      } catch (error) {
        setError(true);
        console.log("Error fetching products");
      }
    };
    fetchData();
  }, [topicId]);

  const handelSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/postQuestion/${topicId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ description: question }),
        }
      );
      if (response.status === 422) {
        localStorage.clear();
        navigate(`/LogIn`);
      }

      if (!response.ok) {
        console.log("Fetch not ok");
        setError(true);
      } else {
        setIsLoading(false);
        navigate(`/questions/${topicId}`);
      }
    } catch (error) {
      setError(true);
    }
  };

  if (error) {
    return <p className="list-item">Oops, something went wrong!</p>;
  }

  return (
    <>
      <h1>Post Question</h1>
      <p className="title">{topic.name}</p>
      <form onSubmit={handelSubmit} className="main-container">
        <input
          placeholder="Enter a question..."
          type="text"
          required
          id="question-description"
          name="question-description"
          className="list-item1"
          value={question}
          onChange={(event) => {
            const value = event.target.value;
            setQuestion(value);
          }}
        />

        <button className="navbtn" disabled={isLoading}>
          Submit
        </button>
      </form>
    </>
  );
};

export default PostQuestion;
