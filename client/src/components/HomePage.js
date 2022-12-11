import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// the topics array to be fetched from the DB
let theTopics = [];

// the branch will be determined by the users menu selections
let branch = "";

const HomePage = () => {
  const [level, setLevel] = useState(-1);
  const navigate = useNavigate(10);
  const token = localStorage.getItem("x-auth-token");

  useEffect(()=>{ if (!token) {
    navigate(`/LogIn`);
  }},[])
 
  // theTopics will be filtered with the use of keys
  const levelKeys = ["year", "term", "topic"];

  // Filtering through the array depending on the level and branch the user is on
  const branchArray = theTopics.filter((x) =>
    level === 0 ? true : x[levelKeys[level - 1]] === branch
  );

  // Mapping to get the data we wish to display
  let displayArray = branchArray.map((x) => x[levelKeys[level]]);

  // To only display unique values
  displayArray = [...new Set(displayArray)];

  // Fetching the topics data from DB

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(`${process.env.REACT_APP_API_URL}/topics`, {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        if(result.status === 422) {
          localStorage.clear();
          navigate(`/LogIn`);
        }
        if (result.ok === false) {
          setLevel(-2);
          return;
        }

        const data = await result.json();
        theTopics = data;
        setLevel(0);
      } catch (err) {
        console.log(err.message);

        setLevel(-2);
        return;
      }
    };
    fetchData();
  }, []);

  // handling menu selections

  const handleClick = (choice) => {
    if (level === 2) {
      const topic = theTopics.filter(
        (e) => e.term === branch && e.topic === choice
      );
      navigate(`/questions/${topic[0].id}`);
    }
    branch = choice;
    setLevel((t) => t + 1);
  };

  // Handle loading and Fetch Error

  if (level === -1) {
    return <p className="list-item">Loading . . .</p>;
  }

  if (level === -2) {
    return <p className="list-item">Oops, something went wrong!</p>;
  }

  // Render a list of buttons using .map method

  return (
    <>
      <p className="title">Home Page</p>
      {displayArray.map((e, i) => (
        <button
          value={e}
          key={i}
          onClick={(e) => handleClick(e.target.value)}
          className="list-item"
        >
          {e}
        </button>
      ))}
    </>
  );
};
export default HomePage;
