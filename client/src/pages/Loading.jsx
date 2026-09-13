import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/Loading";

const Loading = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (nextUrl) {
      const timeout = setTimeout(() => {
        navigate(`/${nextUrl}`);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [nextUrl, navigate]);

  return <LoadingSpinner />;
};

export default Loading;
