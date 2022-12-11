import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import styles from "./EditQuestion.module.css";
const EditQuestion = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState({});
  const [star, setStar] = useState(false);
  const [review, setReview] = useState(false);
  const [starFlag, setStarFlag] = useState(false);
const [error, setError] = useState(false);

  const token = localStorage.getItem("x-auth-token");
  useEffect(()=>{ if (!token) {
    navigate(`/LogIn`);
  }},[])

  // to update the information as per the database
  useEffect(() => {
    const getQuestion = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/editquestion/${questionId}`,
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
      const data = await response.json();
      setQuestion(data);
      setStar(data.isstarred);
      setReview(data.isreviewed);

      if (!response.ok) {
   setError(true);
      } 
    };
    getQuestion();
  }, [questionId]);

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
  const navigate = useNavigate();
  const handleDelete = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/editquestion/${questionId}`,
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
      navigate(`/questions/${question.topicid}`);
    } else {
      return (
        <div>
          <p>Error deleting the question.</p>
          <Link to={`/editquestion/${questionId}`}>Back to Edit Page</Link>
        </div>
      );
    }
  };
  useEffect(() => {
    const edit = async () => {
      if (starFlag) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/editquestion/${questionId}`,
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
          `${process.env.REACT_APP_API_URL}/editquestion/${questionId}`,
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
  }, [star, review, questionId, starFlag, question]);
  if (error) {
    return (
      <p>
        The content does not exists. Please check that the questionId in the URL
        is correct
      </p>
    );
  }
  return (
    <>
      <h2 className="list-item">{question.description}</h2>
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
        <button onClick={handleDelete}>Delete Question</button>
      </div>
    </>
  );
};

export default EditQuestion;
