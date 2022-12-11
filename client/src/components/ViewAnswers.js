import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import EditButton from "./EditButton";
import { useNavigate } from "react-router-dom";

let scope = false;

const ViewAnswers = () => {
  const { questionId } = useParams();

  const [answers, setAnswers] = useState([{ answerdescription: "Loading" }]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("x-auth-token");
  const navigate = useNavigate();
  useEffect(()=>{ if (!token) {
    navigate(`/LogIn`);
  }},[])

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        setIsLoading(false);
        const data = await result.json();
        setAnswers(data);
      } catch (error) {}
    };
    fetchData();
  }, [questionId]);

  const handleClick = () => {
    navigate(`/postanswer/${questionId}`);
  };
  if (error) {
    return (
      <p className="error-list-item list-item">Oops, something went wrong!</p>
    );
  }

  // Render a list of answers

  return (
    <>
      <h1>Answers</h1>
      {isLoading && <p className="loading-list-item list-item">Loading....</p>}

      <p className="title">{answers[0].questiondescription}</p>

      {answers[0].answerdescription === null ? (
        <></>
      ) : (
        answers.map((answer, key) => {
          return (
            <div key={key} className="list-item2 main-container">
              <div className="link">
                {answer.isstarred === true ? " ✅ " : ""}
                {answer.answerdescription}
              </div>
              {scope ? (
                <EditButton information={answer} className="link" />
              ) : (
                <></>
              )}
            </div>
          );
        })
      )}
      <button onClick={handleClick} className="navbtn">
        POST NEW ANSWER
      </button>
    </>
  );
};

export default ViewAnswers;
