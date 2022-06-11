import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import{ login} from '../../features/login/loginSlice';


const NotFound = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("login"));

    if (loginData && loginData.token && loginData.user) {
      navigate("/dashboard");
      dispatch(
        login({
          isLoggedIn: true,
          token: loginData.token,
          user: loginData.user,
        })
      );
    }
  }, []);


  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      display="flex"
      justifyContent="center"
      alignItems='center'
    >
        <Typography fontSize='3rem'>
            404
        </Typography>
        <Typography fontSize='1.5rem'>
            Not Found
        </Typography>
    </Box>
  );
};

export default NotFound;
