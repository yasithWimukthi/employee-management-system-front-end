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

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [isMessage, setIsMessage] = useState(false);
    const [message, setMessage] = useState("");


    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            name: "",
            passwordRepeat: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid Email").required("Email Is Required"),
            password: Yup.string().required("Password Is Required").min(6),
            passwordRepeat: Yup.string()
                .required("Password Is Required")
                .oneOf([Yup.ref("password"), null], "Passwords must match"),
            name: Yup.string().required("Name Is Required"),
        }),
        onSubmit: (values) => {
            setIsLoading(true);
            // register admin user
            fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/signup`, {
                method: "POST",
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    confirmPassword: values.passwordRepeat,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
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
                        navigate("/dashboard", {replace: true});
                        dispatch(
                            login({
                                isLoggedIn: true,
                                token: data.token,
                                user: data.userResult,
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
                <Typography fontSize="1.5rem">SignUp</Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        label="Name"
                        sx={{my: "0.5rem"}}
                        value={formik.values.name}
                        name="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <Box p="0.5rem" sx={{color: "red"}}>
                        {formik.touched.name && formik.errors.name
                            ? formik.errors.name
                            : null}
                    </Box>
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
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            sx={{my: "0.5rem"}}
                            value={formik.values.passwordRepeat}
                            name="passwordRepeat"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type="password"
                        />
                        <Box p="0.5rem" sx={{color: "red"}}>
                            {formik.touched.passwordRepeat && formik.errors.passwordRepeat
                                ? formik.errors.passwordRepeat
                                : null}
                        </Box>
                    </FormControl>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{my: "1rem", p: "0.8rem"}}
                    >
                        SignUp
                    </Button>
                </form>
            </Grid>
        </Grid>
    );
};

export default SignUp;
