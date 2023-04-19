import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import Icon from '@mui/material/Icon';
import TextField from "@mui/material/TextField";
import FormLabel from '@mui/material/FormLabel';
import Select from "react-select";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import api from "../hooks/api";
import { useAuth } from "../hooks/useAuth";

export const OperationPage = () => {
  const { logout } = useAuth();
  const {
    control,
    register,
    handleSubmit,
    setValue,
  } = useForm();
  const [operations, setOperations] = useState([]);
  const [balance, setBalance] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedOperation, setSelectedOperation] = useState("option3");
  const [opLabel, setOpLabel] = useState("");
  const [symbolIcon, setSymbolIcon] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setErrorMessage(null);
      try {
        const operationsResponse = await api.get("/operations");
        const balanceResponse = await api.get("/get-balance");
        const operationsArray = operationsResponse.data || [];
        setOperations(operationsArray);
        setBalance(balanceResponse.data.balance);
      } catch (error) {
        console.error(error);
        setErrorMessage("Error fetching data");
        if (error.response.status === 400) {
          console.log("logout!")
          logout();
        }

      }
    };
    fetchData();
  }, []);

  const handleOperationChange = (event) => {
    const inputOptions = {
      addition: "option1",
      subtraction: "option1",
      multiplication: "option1",
      division: "option1",
      square_root: "option2",
      random_string: "option3",
    };

    const symbolOption = {
      addition: "+",
      subtraction: "-",
      multiplication: "x",
      division: "/",
      square_root: "√",
    };
    setSymbolIcon(symbolOption[event.label])
    setOpLabel(event.label);
    setSelectedOperation(inputOptions[event.label]);
    setValue("operation", event.label);
  };

  const handleCalculate = async (data) => {
    setErrorMessage(null);
    try {
      const response = await api.post("/operations", data);
      setBalance(response.data.userBalance);
      setResult(response.data.operationResponse);
    } catch (error) {
      console.error(error);
      setErrorMessage("Error calculating. Check your credit");
      if (error.response.status === 400) {
        console.log("logout!")
        logout();
      }
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        Current Balance: {balance}
      </Typography>
      <form onSubmit={handleSubmit(handleCalculate)}>
        <Controller
          name="operation"
          render={({ field }) => (
            <Select
              {...field}
              options={operations.map( (op) => {
                return {
                  value: op.id,
                  label: op.operationType
                }
              })}
              onChange={handleOperationChange}
              name="operation"
              value={field.value}
            />
          )}
          control={control}
          register={register}
          defaultValue=""
        />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
          <FormLabel>
            {opLabel}
          </FormLabel>
        </Box>
        {selectedOperation === "option1" && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TextField
              {...register("value1", {
                required: true,
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Only numbers are allowed"
                }
              })}
              margin="normal"
              inputMode="numeric"
              sx={{ marginRight: 2 }}
            />
            <Icon>{ symbolIcon }</Icon>
            <TextField
              {...register("value2", {
                required: true,
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Only numbers are allowed"
                }
              })}
              margin="normal"
              inputMode="numeric"
              sx={{ marginLeft: 2 }}
            />
          </Box>
        )}
        {selectedOperation === "option2" && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon>{ symbolIcon }</Icon>
            <TextField
              {...register("value1", {
                required: true,
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Only numbers are allowed"
                }
              })}
              margin="normal"
              inputMode="numeric"
              sx={{ marginLeft: 2 }}
            />
          </Box>
        )}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Calculate
        </Button>
        {result && (
          <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
            Result: {result}
          </Typography>
        )}

        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
      </form>
    </Box>
  );
};



