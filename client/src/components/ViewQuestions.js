import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import EditButton from "./EditButton";
import { useNavigate } from "react-router-dom";
// import { FaPlusCircle } from "react-icons/fa";

let scope = false;

const ViewQuestions = () => {
  const { topicId } = useParams();
  const [questions, setQuestions] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const token = localStorage.getItem("x-auth-token");
  
  useEffect(()=>{ if (!token) {
    navigate(`/LogIn`);
  }},[])

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/questions/${topicId}`,
          {
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );
        
        if (response.status === 422) {
          localStorage.clear();
          navigate(`/LogIn`);
        }
        if (response.ok === false) {
          setLoading(false);
          setError(true);
          return;
        }
        setLoading(false);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  if (error) {
    return <p className="list-item">Oops, something went wrong!</p>;
  }

  const handleClick = () => {
    navigate(`/postquestion/${topicId}`);
  };

  return (
    <>
      {loading && <p className="title">Loading....</p>}
      <p className="title">{questions[0].name}</p>

      {questions[0].description === null ? (
        <></>
      ) : (
        questions.map((e, i) => {
          return (
            <div key={i} className="main-container list-item">
              <Link className="link" to={"/answers/" + e.id}>
                {e.isstarred === true ? " 🔥  " : ""}
                {e.description}
              </Link>

              {scope ? <EditButton className="link" information={e} /> : <></>}
            </div>
          );
        })
      )}

      <button onClick={handleClick} className="navbtn">
        POST NEW QUESTION
      </button>
    </>
  );
};

export default ViewQuestions;
