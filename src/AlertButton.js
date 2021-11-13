import { Button } from "@mui/material";

function AlertButton({ val }) {
  return (
    <>
      <Button variant="contained" size="small">
        {" "}
        {val.current}
      </Button>
    </>
  );
}

export default AlertButton;
