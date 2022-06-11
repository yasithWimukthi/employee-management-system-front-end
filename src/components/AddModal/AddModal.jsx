import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import TagsInput from "../TagInput/TagInput";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Message from "../Message/Message";

const actions = {
    TOGGLE: "toggle",
    DATA: "data",
    ROW_CLICK: "rowclick",
    ADD_MODAL_TOGGLE: "addmodal",
};

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};


const AddModal = ({open, dispatch, refresh}) => {
    const handleClose = () => dispatch({type: actions.ADD_MODAL_TOGGLE});
    const ref = useRef();
    const [selectedPhones, setSelectedPhones] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState([]);
    const [selectedDept, setSelectedDept] = useState("");
    const [selectedDesignation, setSelectedDesignation] = useState("");
    const [deptsAndDesignations, setDeptsAndDesignations] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isMessage, setIsMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({
        phone: {
            isError: false,
            message: "Phone number cannot be empty  ! (use contrl + enter)",
            isTouched: false,
        },
        address: {
            isError: false,
            message: "Address cannot be empty  ! (use ctrl + enter)",
            isTouched: false,
        },
        dept: {
            isError: false,
            message: "Department cannot be empty",
        },
        designation: {
            isError: false,
            message: "Designation cannot be empty",
        },
    });

    const handleSubmit = (values) => {
        handlePhoneBlur();
        handleAddressBlur();
        if (
            selectedAddress.length > 0 &&
            selectedPhones.length > 0 &&
            selectedDept.length > 0 &&
            selectedDesignation.length > 0
        ) {
            setIsLoading(true);
            //ADD EMPLOYEE TO DATABASE
            fetch(`${process.env.REACT_APP_BASE_URL}/api/employee/add`, {
                method: "POST",
                body: JSON.stringify({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    birthDate: values.bday,
                    address: selectedAddress,
                    contactNumber: selectedPhones,
                    department: selectedDept,
                    designation: selectedDesignation,
                    employeeId: values.employeeId,
                    nic: values.nic,
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
                        setIsMessage(true);
                        setMessage(data.message);
                    }
                })
                .catch((err) => {
                    setIsMessage(true);
                    setMessage(err.message);
                })
                .finally(() => setIsLoading(false));
        } else {
            if (selectedAddress.length <= 0) {
                setErrors((prev) => ({
                    ...prev,
                    address: {
                        isError: true,
                        message: "Address cannot be empty  ! (use contrl + enter)",
                        isTouched: true,
                    },
                }));
            }

            if (selectedPhones.length <= 0) {
                setErrors((prev) => ({
                    ...prev,
                    phone: {
                        isError: true,
                        message: "Phone number cannot be empty  ! (use contrl + enter)",
                        isTouched: true,
                    },
                }));
            }

            if (selectedDept.length <= 0) {
                setErrors((prev) => ({
                    ...prev,
                    dept: {
                        isError: true,
                        message: "Department cannot be empty",
                    },
                }));
            }
            if (selectedDesignation.length <= 0) {
                setErrors((prev) => ({
                    ...prev,
                    designation: {
                        isError: true,
                        message: "Designation cannot be empty",
                    },
                }));
            }
        }
    };

    useEffect(() => {
        if (selectedAddress.length <= 0 && errors.address.isTouched) {
            setErrors((prev) => ({
                ...prev,
                address: {
                    isError: true,
                    message: "Address cannot be empty  ! (use contrl + enter)",
                    isTouched: true,
                },
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                address: {
                    isError: false,
                    message: "Address cannot be empty  ! (use contrl + enter)",
                    isTouched: true,
                },
            }));
        }
    }, [selectedAddress]);

    useEffect(() => {
        if (selectedPhones.length <= 0 && errors.phone.isTouched) {
            setErrors((prev) => ({
                ...prev,
                phone: {
                    isError: true,
                    message: "Phone number cannot be empty ! (use contrl + enter)",
                    isTouched: true,
                },
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                phone: {
                    isError: false,
                    message: "Phone number cannot be empty  ! (use contrl + enter)",
                    isTouched: true,
                },
            }));
        }
    }, [selectedPhones]);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/get-all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                } else {
                    const details = {};
                    data.result.map((item) => {
                        details[item.name] = item.designation;
                        return item;
                    });

                    setDeptsAndDesignations(details);
                }
            })
            .catch((err) => {
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleDeptBlur = () => {
        if (selectedDept.length <= 0) {
            setErrors((prev) => ({
                ...prev,
                dept: {
                    isError: true,
                    message: "Department cannot be empty",
                },
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                dept: {
                    isError: false,
                    message: "Department cannot be empty",
                },
            }));
        }
    };

    const handleDesignationBlur = () => {
        if (selectedDesignation.length <= 0) {
            setErrors((prev) => ({
                ...prev,
                designation: {
                    isError: true,
                    message: "Designation cannot be empty",
                },
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                designation: {
                    isError: false,
                    message: "Designation cannot be empty",
                },
            }));
        }
    };

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            bday: "",
            nic: "",
            employeeId: "",
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required("first name Is Required"),
            lastName: Yup.string().required("last name Is Required"),
            bday: Yup.string().required("birthday Is Required"),
            nic: Yup.string().required("Nic Is Required"),
            employeeId: Yup.string().required("Employee id Is Required"),
        }),
        onSubmit: handleSubmit,
    });

    const dateFocusHandler = () => {
        ref.current.type = "date";
    };

    const dateFocusOutHandler = () => {
        ref.current.type = "text";
    };

    const handlePhoneTags = (items) => {
        console.log(items);
    };

    const handleAddressTags = (items) => {
        console.log(items);
    };

    const deptChangeHandler = (e) => {
        setSelectedDept(e.target.value);
    };

    const handlePhoneBlur = () => {
        setErrors((prev) => ({
            ...prev,
            phone: {
                isTouched: true,
                isError: prev.phone.isError,
                message: prev.phone.message,
            },
        }));
    };

    const handleAddressBlur = () => {
        setErrors((prev) => ({
            ...prev,
            address: {
                isTouched: true,
                isError: prev.address.isError,
                message: prev.address.message,
            },
        }));
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {isLoading && <LoadingSpinner/>}
                    {isMessage && (
                        <Message
                            message={message}
                            open={isMessage}
                            onClose={() => {
                                setIsMessage(false);
                                handleClose();
                                refresh((p) => !p);
                            }}
                        />
                    )}
                    <form onSubmit={formik.handleSubmit} onBlur={formik.handleBlur}>
                        <TextField
                            sx={{my: "0.5rem"}}
                            type="text"
                            size="small"
                            fullWidth
                            value={formik.values.employeeId}
                            onChange={formik.handleChange}
                            name="employeeId"
                            onBlur={formik.handleBlur}
                            label="Employee Id"
                        />

                        {formik.touched.employeeId && formik.errors.employeeId ? (
                            <Box p="0.1rem" sx={{color: "red"}}>
                                {formik.errors.employeeId}
                            </Box>
                        ) : null}
                        <TextField
                            sx={{my: "0.1rem"}}
                            type="text"
                            size="small"
                            fullWidth
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            name="firstName"
                            onBlur={formik.handleBlur}
                            label="First Name"
                        />

                        {formik.touched.firstName && formik.errors.firstName ? (
                            <Box p="0.1rem" sx={{color: "red"}}>
                                {formik.errors.firstName}
                            </Box>
                        ) : null}

                        <TextField
                            sx={{my: "0.5rem"}}
                            type="text"
                            size="small"
                            fullWidth
                            label="Last Name"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            name="lastName"
                            onBlur={formik.handleBlur}
                        />

                        {formik.touched.lastName && formik.errors.lastName ? (
                            <Box p="0.1rem" sx={{color: "red"}}>
                                {formik.errors.lastName}
                            </Box>
                        ) : null}

                        <TextField
                            sx={{my: "0.5rem"}}
                            placeholder="BirthDay"
                            inputRef={ref}
                            onFocus={dateFocusHandler}
                            onBlur={(e) => {
                                dateFocusOutHandler();
                                formik.handleBlur(e);
                            }}
                            size="small"
                            fullWidth
                            value={formik.values.bday}
                            onChange={formik.handleChange}
                            name="bday"
                            label='Birthday'
                        />

                        {formik.touched.bday && formik.errors.bday ? (
                            <Box p="0.1rem" sx={{color: "red"}}>
                                {formik.errors.bday}
                            </Box>
                        ) : null}

                        <TagsInput
                            selectedTags={handlePhoneTags}
                            fullWidth
                            variant="outlined"
                            id="tags"
                            name="phone"
                            placeholder="Phone Number"
                            label='Phone Number'
                            selectedItem={selectedPhones}
                            setSelectedItem={setSelectedPhones}
                        />
                        {errors.phone.isError ? (
                            <Box p="0.1rem" sx={{color: "red"}}>
                                {errors.phone.message}
                            </Box>
                        ) : null}

                        <TagsInput
                            selectedTags={handleAddressTags}
                            fullWidth
                            variant="outlined"
                            id="tags"
                            name="address"
                            placeholder="Address"
                            selectedItem={selectedAddress}
                            setSelectedItem={setSelectedAddress}
                            label='Address'
                        />
                        {errors.address.isError ? (
                            <Box p="0.1rem" sx={{color: "red"}}>
                                {errors.address.message}
                            </Box>
                        ) : null}

                        <FormControl fullWidth size="small" sx={{my: "0.5rem"}}>
                            <InputLabel id="demo-simple-select-label">Department</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                name="depaartment"
                                label="Department"
                                onChange={deptChangeHandler}
                                value={selectedDept}
                                onBlur={handleDeptBlur}
                            >
                                {Object.keys(deptsAndDesignations).map((item, i) => {
                                    return (
                                        <MenuItem key={i} value={item}>
                                            {item}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        {errors.dept.isError ? (
                            <Box p="0.1rem" sx={{color: "red"}}>
                                {errors.dept.message}
                            </Box>
                        ) : null}

                        <FormControl fullWidth size="small" sx={{my: "0.5rem"}}>
                            <InputLabel id="demo-simple-select-label">Designation</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                name="designation"
                                label="Department"
                                value={selectedDesignation}
                                onChange={(e) => setSelectedDesignation(e.target.value)}
                                onBlur={handleDesignationBlur}
                            >
                                {deptsAndDesignations[selectedDept] &&
                                    deptsAndDesignations[selectedDept].map((item, i) => {
                                        return (
                                            <MenuItem key={i} value={item}>
                                                {item}
                                            </MenuItem>
                                        );
                                    })}
                            </Select>
                        </FormControl>
                        {errors.designation.isError ? (
                            <Box p="0.1rem" sx={{color: "red"}}>
                                {errors.designation.message}
                            </Box>
                        ) : null}

                        <TextField
                            sx={{my: "0.5rem"}}
                            type="text"
                            size="small"
                            fullWidth
                            label="NIC"
                            value={formik.values.nic}
                            onChange={formik.handleChange}
                            name="nic"
                            onBlur={formik.handleBlur}
                        />

                        {formik.touched.nic && formik.errors.nic ? (
                            <Box p="0.1rem" sx={{color: "red"}}>
                                {formik.errors.nic}
                            </Box>
                        ) : null}

                        <Box display="flex" gap={2} mt={"0.5rem"}>
                            <Button
                                variant="contained"
                                fullWidth
                                type="reset"
                                name="reset"
                                onClick={() => {
                                    formik.handleReset();
                                }}
                            >
                                Reset
                            </Button>
                            <Button variant="contained" fullWidth type="submit" name="submit">
                                Add
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default AddModal;
