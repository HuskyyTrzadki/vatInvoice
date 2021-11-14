import AlertButton from "./AlertButton";
import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useRef, useEffect } from "react";
import { InputAdornment } from "@mui/material";

function Form() {
  const axios = require("axios").default;
  const vatNumberRef = useRef();
  const amountRef = useRef();

  const [values, setValues] = useState({
    vatNumber: "",
    companyName: "",
    address: "",
    price: "",
    priceGross: "",
    vatNumberErr: false,
    countryCode: "",
  });

  const apiKey = "89c246afef2140c580a5908c931b4f93";
  useEffect(() => {
    vatNumberRef.current.focus();
  }, [values.vatNumberErr]);

  const tryToFillPriceGross = async () => {
    const result = await axios
      .get(
        `https://vat.abstractapi.com/v1/calculate/?api_key=${apiKey}&amount=${values.price}&country_code=${values.countryCode}`
      )
      .catch((err) => {
        console.log(err);
      });
    if (result) {
      setValues({
        ...values,
        priceGross: result.data.vat_amount,
      });
      return;
    }
    setValues({
      ...values,
      companyName: "",
      address: "",
      price: "",
      priceGross: "",
      vatNumberErr: true,
    });
  };
  const tryToFillAddressAndName = async () => {
    const result = await axios
      .get(
        `https://vat.abstractapi.com/v1/validate/?api_key=${apiKey}&vat_number=${values.vatNumber}`
      )
      .catch((err) => {
        console.log(err);
      });
    if (result && result.data.valid) {
      setValues({
        ...values,
        companyName: result.data.company.name,
        address: result.data.company.address,
        countryCode: result.data.country.code,
        vatNumberErr: false,
      });
      amountRef.current.focus();

      return;
    }
    setValues({
      ...values,
      companyName: "",
      address: "",
      price: "",
      priceGross: "",
      vatNumberErr: true,
      countryCode: "",
    });
  };

  return (
    <>
      <Box>
        <form>
          <TextField
            fullWidth
            error={values.vatNumberErr}
            label="VAT number"
            value={values.vatNumber}
            inputRef={vatNumberRef}
            helperText={
              !values.vatNumberErr
                ? "based on Vat number, we will pre-populate the rest of the form"
                : "wrong Vat nr"
            }
            onChange={(e) => {
              setValues({
                ...values,
                vatNumber: e.target.value,
              });
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                tryToFillAddressAndName();
              }
            }}
          />
          <TextField
            fullWidth
            disabled="true"
            label="Company Name"
            variant={`${values.companyName}` ? "filled" : "outlined"}
            value={values.companyName}
            onChange={(e) => {
              setValues({
                ...values,
                companyName: e.target.value,
              });
            }}
          />
          <TextField
            fullWidth
            disabled="true"
            variant={`${values.companyName}` ? "filled" : "outlined"}
            label="address"
            value={values.address}
            endAdornment={<InputAdornment position="end">kg</InputAdornment>}
            onChange={(e) => {
              setValues({
                ...values,
                address: e.target.value,
              });
            }}
          />
          <TextField
            fullWidth
            label="Price"
            value={values.price}
            inputRef={amountRef}
            onChange={(e) => {
              setValues({
                ...values,
                price: e.target.value,
              });
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                tryToFillPriceGross();
              }
            }}
          />
          <TextField
            fullWidth
            label="Price gross"
            disabled="true"
            value={values.priceGross}
            onChange={(e) => {
              setValues({
                ...values,
                priceGross: e.target.value,
              });
            }}
          />
          <AlertButton />
        </form>
      </Box>
    </>
  );
}

export default Form;
