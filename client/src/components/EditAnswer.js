import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import styles from "./EditQuestion.module.css";

const EditAnswer = () => {
  const { answerId } = useParams();
  const [answer, setAnswer] = useState({});
  const [star, setStar] = useState(false);
  const [review, setReview] = useState(false);
  const [starFlag, setStarFlag] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("x-auth-token");
  useEffect(()=>{ if (!token) {
    navigate(`/LogIn`);
  }},[])

  // to update the information as per the database
  useEffect(() => {
    const getAnswer = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/editanswer/${answerId}`,
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
      if (!response.ok) {
          setError(true);
      }
      const data = await response.json();
      setAnswer(data);
      setStar(data.isstarred);
      setReview(data.isreviewed);
    };
    getAnswer();
  }, [answerId]);

  // to handle the user events
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.id === "star") {
      setStarFlag(true);
      setStar(e.target.checked);
    } else {
      setStarFlag(false);
      setReview(e.target.checked);
    }
  };

  // handle delete post
  const handleDelete = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/editanswer/${answerId}`,
      {
        method: "DELETE",
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
    if (response.ok) {
      navigate(`/answers/${answer.questionid}`);
    } else {
      return (
        <div>
          <p>Error deleting the question.</p>
          <Link to={`/editanswer/${answerId}`}>Back to Edit Page</Link>
        </div>
      );
    }
  };

  //handle updating the database as per the user events.
  useEffect(() => {
    const edit = async () => {
      if (starFlag) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/editanswer/${answerId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
            body: JSON.stringify({
              starFlag,
              isStarred: star,
              isReviewed: review,
            }),
          }
        );
        if (response.status === 422) {
          localStorage.clear();
          navigate(`/LogIn`);
        }
      } else {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/editanswer/${answerId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
            body: JSON.stringify({
              starFlag,
              isStarred: star,
              isReviewed: review,
            }),
          }
        );
        if (response.status === 422) {
          localStorage.clear();
          navigate(`/LogIn`);
        }
      }
    };
    edit();
  }, [star, review, answerId, starFlag, answer]);
  if (error) {
    return (
      <p>
        The content does not exists. Please check that the answerId in the URL
        is correct
      </p>
    );
  }
  return (
    <>
      <h1 className="title">{answer.questiondescription}</h1>
      <p className="list-item">{answer.description}</p>
      <div className={styles.editbar}>
        <div>
          <label htmlFor="review">Review</label>
          <input
            id="review"
            type="checkbox"
            checked={review}
            className={styles.checkbox}
            onChange={(e) => handleChange(e)}
            data-testid="review-checkbox"
          />
        </div>
        <div>
          <label htmlFor="star">Star</label>
          <input
            id="star"
            type="checkbox"
            checked={star}
            className={styles.checkbox}
            onChange={(e) => handleChange(e)}
            data-testid="star-checkbox"
          />
        </div>
        <button onClick={handleDelete}>Delete Answer</button>
      </div>
    </>
  );
};

export default EditAnswer;
