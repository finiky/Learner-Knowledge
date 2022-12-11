import { useNavigate } from "react-router-dom";
const EditButton = ({ information }) => {
  const navigate = useNavigate();
  const handleClick = async () => {
    
    if (information.topicid) {
      navigate(`/editquestion/${information.id}`);
    } else {
      navigate(`/editanswer/${information.id}`);
    }
  };
  return <button onClick={handleClick} className="link">Edit Post</button>;
};

export default EditButton;
