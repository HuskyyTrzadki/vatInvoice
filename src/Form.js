import AlertButton from "./AlertButton";
import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";

function Form() {
  const [vatNumber, setVatNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [adress, setAdress] = useState("");
  const [price, setPrice] = useState("");
  const [priceGross, setPriceGross] = useState("");

  return (
    <>
      <Box>
        <form>
          <TextField
            fullWidth
            label="VAT number"
            value={vatNumber}
            onChange={(e) => {
              setVatNumber(e.target.value);
            }}
          />
          <TextField
            fullWidth
            label="Company Name"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
            }}
          />
          <TextField
            fullWidth
            label="adress"
            value={adress}
            onChange={(e) => {
              setAdress(e.target.value);
            }}
          />
          <TextField
            fullWidth
            label="Price"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
          <TextField
            fullWidth
            label="Price gross"
            value={price}
            onChange={(e) => {
              setPriceGross(e.target.value);
            }}
          />
          <AlertButton val={vatNumber} />
        </form>
      </Box>
    </>
  );
}

export default Form;
