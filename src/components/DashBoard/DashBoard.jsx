import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useEffect, useReducer, useState } from "react";
import UpdateModal from "../UpdateModal/UpdateModal";
import AddModal from "../AddModal/AddModal";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Message from "../Message/Message";
import {useDispatch} from 'react-redux';
import {logout} from '../../features/login/loginSlice';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

const initialValues = {
  isOpen: false,
  data: null,
  isAddModalOpen: false,
};

const actions = {
  TOGGLE: "toggle",
  DATA: "data",
  ROW_CLICK: "rowclick",
  ADD_MODAL_TOGGLE: "addmodal",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.TOGGLE:
      return { ...state, isOpen: !state.isOpen };
    case actions.DATA:
      return { ...state, data: action.payload };
    case actions.ROW_CLICK:
      return { ...state, isOpen: true, data: action.payload };
    case actions.ADD_MODAL_TOGGLE:
      return { ...state, isAddModalOpen: !state.isAddModalOpen };
    default:
      return state;
  }
};

const DashBoard = () => {
  const [modalState, dispatch] = useReducer(reducer, initialValues);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [refresh, setRefreh] = useState(false);
  const reduxDispatch = useDispatch();
  const navigate = useNavigate();

  const columns = [
    { field: "employeeId", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "birthDate",
      headerName: "Birthday",
      type: "date",
      width: 150,
    },
    {
      field: "address",
      headerName: "Address",
      description: "This column has a value getter and is not sortable.",
      width: 250,
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 150,
    },
    {
      field: "department",
      headerName: "Department",
      description: "This column has a value getter and is not sortable.",
      width: 80,
    },
    {
      field: "designation",
      headerName: "Designation",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 150,
    },
    {
      field: "nic",
      headerName: "NIC",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 150,
    },
    {
      field: "action",
      headerName: "",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking

          setIsLoading(true);
          fetch(`${process.env.REACT_APP_BASE_URL}/api/employee/delete`, {
            method: "POST",
            body: JSON.stringify({
              id: params.id,
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
        };

        return (
          <Button onClick={onClick}>
            <DeleteIcon />
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_BASE_URL}/api/employee/get-all`, {
      method: "GET",
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
          setRows(data.result);
          console.log(data);
        }
      })
      .catch((err) => {
        setIsMessage(true);
        setMessage(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [refresh]);

  return (
    <Box width={"100vw"} height="100vh">
      <UpdateModal
        open={modalState.isOpen}
        dispatch={dispatch}
        data={modalState.data}
        refresh={setRefreh}
      />
      <AddModal
        open={modalState.isAddModalOpen}
        dispatch={dispatch}
        refresh={setRefreh}
      />

      {isLoading && <LoadingSpinner />}
      {isMessage && (
        <Message
          message={message}
          open={isMessage}
          onClose={() => {
            setIsMessage(false);
            setRefreh((p) => !p);
          }}
        />
      )}
      <Grid container height={{ xs: "85vh", lg: "80vh" }}>
        <Grid
          display="flex"
          item
          p="2.5vh"
          sx={{ backgroundColor: "primary.light" }}
          xs={12}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography color="primary.main">Employee Management</Typography>
          <Button
            onClick={() => dispatch({ type: actions.ADD_MODAL_TOGGLE })}
            color="primary"
            variant="contained"
          >
            Add
          </Button>
        </Grid>

        <Grid item width="100%" height="100%" m="0.5rem">
          <DataGrid
            getRowId={(row) => row._id}
            rows={rows}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8]}
            onRowClick={(data) => {
              dispatch({ type: actions.ROW_CLICK, payload: data.row });
            }}
          />
        </Grid>
      </Grid>
      <Box
        display="flex"
        justifyContent="flex-start"
        position="fixed"
        bottom={'2%'}
        left='1%'
      >
        <Button
          onClick={() => {
            reduxDispatch(logout());
            localStorage.removeItem('login');
            navigate('/')
          }}
          color="primary"
          variant="contained"
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default DashBoard;
