import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button, Grid, Checkbox, FormControlLabel } from "@mui/material";
import debounce from "lodash.debounce";

function Form() {
  const [checked, setChecked] = useState(false);

  const axios = require("axios").default;
  const vatNumberRef = useRef();
  const amountRef = useRef();
  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };

  //?.?.

  const [values, setValues] = useState({
    vatNumber: "",
    companyName: "",
    address: "",
    price: "",
    priceGross: "",
    vatNumberErr: false,
    countryCode: "",
  });
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const apiKey = "4c52ab1ce93b40b3ab8310baf6c68408";
  useEffect(() => {
    vatNumberRef.current.focus();
  }, [values.vatNumberErr]);

  const debouncedSave = useCallback(
    debounce((nextValue) => {
      tryToFillAddressAndName(nextValue);
    }, 1500),

    []
  );
  const handleVatChange = (event) => {
    const nextValue = event.target.value;

    setValues({ ...values, vatNumber: nextValue });

    debouncedSave(nextValue);
  };
  useEffect(() => {
    console.log(values);
  }, [values]);

  const setPriceAndCalculatePriceGross = (event) => {
    if (!/[a-zA-Z]/.test(event.target.value)) {
      setValues({
        ...values,
        price: event.target.value,
        priceGross: Math.round(((event.target.value * 23) / 100) * 100) / 100,
      });
    }
  };
  const tryToFillAddressAndName = async (name) => {
    const result = await axios
      .get(
        `https://vat.abstractapi.com/v1/validate/?api_key=${apiKey}&vat_number=${name}`
      )
      .catch((err) => {
        console.log(err);
      });
    if (result?.data?.valid) {
      setValues({
        vatNumber: name,
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
      <form>
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",

            transform: "translate(-50%, -50%)",
            border: "5px solid black",
            padding: "10px",
          }}
        >
          <FormControlLabel
            label="allow edit"
            control={
              <Checkbox checked={checked} onChange={handleCheckChange} />
            }
          />

          <Grid container spacing={3} direction="column" alignItems="center">
            <Grid item>
              <TextField
                fullWidth
                error={values.vatNumberErr}
                label="VAT number"
                value={values.vatNumber}
                inputRef={vatNumberRef}
                helperText={
                  !values.vatNumberErr
                    ? "type vat NR, we`ll pre-populate rest"
                    : "you typed wrong Vat nr try again  "
                }
                onChange={handleVatChange}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    tryToFillAddressAndName(e.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                disabled={!checked}
                label="Company Name"
                name="companyName"
                variant={`${values.companyName}` ? "filled" : "outlined"}
                value={values.companyName}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                disabled={!checked}
                variant={`${values.companyName}` ? "filled" : "outlined"}
                name="address"
                label="address"
                value={values.address}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                name="Price"
                label="Price"
                value={values.price}
                inputRef={amountRef}
                onChange={setPriceAndCalculatePriceGross}
                // onKeyUp={(e) => {
                //   if (e.key === "Enter") {
                //     setPriceAndCalculatePriceGross
                //   }
                // }}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                helperText=" price gross calculated automatically"
                disabled={!checked}
                name="priceGross"
                value={values.priceGross}
                variant={`${values.priceGross}` ? "filled" : "outlined"}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  alert(JSON.stringify(values));
                }}
                variant="contained"
              >
                Click me
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </>
  );
}

export default Form;
