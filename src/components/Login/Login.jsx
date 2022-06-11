import {Visibility, VisibilityOff} from "@mui/icons-material";
import {
    Button,
    Grid,
    IconButton,
    InputAdornment,
    OutlinedInput,
    TextField,
    Typography,
    FormControl,
    InputLabel,
} from "@mui/material";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Box} from "@mui/system";
import {useDispatch} from "react-redux";
import {login} from "../../features/login/loginSlice";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Message from "../Message/Message";
import {useEffect} from "react";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMessage, setIsMessage] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid Email").required("Email Is Required"),
            password: Yup.string().required("Password Is Required"),
        }),
        onSubmit: (values) => {
            setIsLoading(true);
            // check login credentials
            fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, {
                method: "POST",
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        setIsMessage(true);
                        setMessage(data.error);
                    } else {
                        localStorage.setItem(
                            "login",
                            JSON.stringify({
                                token: data.token,
                                user: data.user,
                            })
                        );
                        navigate("/dashboard");
                        dispatch(
                            login({
                                isLoggedIn: true,
                                token: data.token,
                                user: data.user,
                            })
                        );
                    }
                })
                .catch((err) => {
                    setIsMessage(true);
                    setMessage(err.message);
                })
                .finally(() => setIsLoading(false));
        },
    });

    const handleClickShowPassword = () => {
        setShowPassword((p) => !p);
    };

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
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            width="100vw"
            height="100vh"
            boxSizing="border-box"
        >
            {isLoading && <LoadingSpinner/>}
            {isMessage && (
                <Message
                    message={message}
                    open={isMessage}
                    onClose={() => {
                        setIsMessage(false);
                    }}
                />
            )}
            <Grid item xs={12} lg={3.5} p={"1rem"}>
                <Typography fontSize="1.5rem">Login</Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        sx={{my: "0.5rem"}}
                        value={formik.values.email}
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <Box p="0.5rem" sx={{color: "red"}}>
                        {formik.touched.email && formik.errors.email
                            ? formik.errors.email
                            : null}
                    </Box>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-password">
                            Password
                        </InputLabel>
                        <OutlinedInput
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={formik.values.password}
                            name="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowPassword} edge="end">
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <Box p="0.5rem" sx={{color: "red"}}>
                            {formik.touched.password && formik.errors.password
                                ? formik.errors.password
                                : null}
                        </Box>
                    </FormControl>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{my: "1rem", p: "0.8rem"}}
                    >
                        Login
                    </Button>
                </form>
                <Button
                    sx={{
                        "&:hover": {
                            backgroundColor: "white",
                        },
                    }}
                    onClick={() => navigate('/signup')}
                >
                    Need An Account?
                </Button>
            </Grid>
        </Grid>
    );
};

export default Login;
