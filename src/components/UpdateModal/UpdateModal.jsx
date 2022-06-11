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
import {useRef, useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import TagsInput from "../TagInput/TagInput";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Message from "../Message/Message";

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

const actions = {
    TOGGLE: "toggle",
    DATA: "data",
    ROW_CLICK: "rowclick",
    ADD_MODAL_TOGGLE: "addmodal",
};

// const deptsAndDesignations = {
//   HR: ["Manager", "Assistant"],
//   IT: ["Senior Software Engineer", "Associate", "Junior Developer"],
// };

const UpdateModal = ({open, dispatch, data, refresh}) => {
    const handleClose = () => dispatch({type: actions.TOGGLE});
    const ref = useRef();
    const [selectedPhones, setSelectedPhones] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState([]);
    const [selectedDept, setSelectedDept] = useState("");
    const [selectedDesignation, setSelectedDesignation] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isMessage, setIsMessage] = useState(false);
    const [message, setMessage] = useState("");

    const [deptsAndDesignations, setDeptsAndDesignations] = useState([]);


    useEffect(() => {
        setIsLoading(true);
        // fetch all employee details
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


    const handleSubmit = (values) => {

        if (
            selectedAddress.length > 0 &&
            selectedPhones.length > 0 &&
            selectedDept.length > 0 &&
            selectedDesignation.length > 0
        ) {

            setIsLoading(true);
            // update employee details
            fetch(`${process.env.REACT_APP_BASE_URL}/api/employee/update`, {
                method: "POST",
                body: JSON.stringify({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    birthDate: values.bday,
                    address: selectedAddress,
                    contactNumber: selectedPhones,
                    department: selectedDept,
                    designation: selectedDesignation,
                    employeeId: data.employeeId,
                    nic: values.nic,
                    id: data._id
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
        }
    };

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            bday: "",
            nic: "",
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required("first name Is Required"),
            lastName: Yup.string().required("last name Is Required"),
            bday: Yup.string().required("birthday Is Required"),
            nic: Yup.string().required("Password Is Required"),
        }),
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        formik.setValues({
            firstName: data?.firstName || "",
            lastName: data?.lastName || "",
            bday: data?.birthDate || "",
            dept: data?.department || "",
            designation: data?.designation || "",
            nic: data?.nic || "",
        });
        setSelectedAddress(data?.address || []);
        setSelectedPhones(data?.contactNumber || []);
        setSelectedDept(data?.department || "");
        setSelectedDesignation(data?.designation || "");
    }, [data]);

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
                                refresh(p => !p);
                            }}
                        />
                    )}

                    <form onSubmit={formik.handleSubmit} onBlur={formik.handleBlur}>
                        <TextField
                            sx={{my: "0.5rem"}}
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
                            <Box p="0.5rem" sx={{color: "red"}}>
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
                            <Box p="0.5rem" sx={{color: "red"}}>
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
                            name="birthday"
                            label='Birthday'
                        />

                        {formik.touched.bday && formik.errors.bday ? (
                            <Box p="0.5rem" sx={{color: "red"}}>
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
                            selectedItem={selectedPhones}
                            setSelectedItem={setSelectedPhones}
                            label='Phone Number'
                        />

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

                        <FormControl fullWidth size="small" sx={{my: "0.5rem"}}>
                            <InputLabel id="demo-simple-select-label">Department</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                name="depaartment"
                                label="Department"
                                onChange={deptChangeHandler}
                                value={selectedDept}
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

                        <FormControl fullWidth size="small" sx={{my: "0.5rem"}}>
                            <InputLabel id="demo-simple-select-label">Designation</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                name="designation"
                                label="Department"
                                value={selectedDesignation}
                                onChange={(e) => setSelectedDesignation(e.target.value)}
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
                            <Box p="0.5rem" sx={{color: "red"}}>
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
                                Update
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default UpdateModal;
