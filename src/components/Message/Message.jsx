import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const Message = ({ open, onClose, message }) => {
  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography color='black'>{message}</Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Message;
