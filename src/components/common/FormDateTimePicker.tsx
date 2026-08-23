import React from "react";
import { Controller, Control } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

interface FormDateTimePickerProps {
  name: string;
  control: Control<any>;
  label?: string;
  error?: string;
}

const FormDateTimePicker = ({
  name,
  control,
  label,
  error,
}: FormDateTimePickerProps) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-xs font-semibold text-zinc-500 block mb-0.5">
          {label}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) => {
                field.onChange(newValue ? newValue.toISOString() : null);
              }}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  error: !!error,
                  slotProps: {
                    htmlInput: {
                      placeholder: "Select date and time",
                    },
                  },
                  sx: {
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontFamily: "inherit",
                      fontWeight: 500,
                      "& fieldset": {
                        borderColor: error ? "#f43f5e" : "#e4e4e7",
                      },
                      "&:hover fieldset": {
                        borderColor: error ? "#f43f5e" : "#a1a1aa",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: error ? "#f43f5e" : "#8B5CF6",
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "10px 16px",
                        height: "auto",
                        color: "#18181b",
                        "&::placeholder": {
                          color: "#a1a1aa",
                          opacity: 0.8,
                          fontSize: "12px",
                        },
                      },
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        )}
      />
      {error && (
        <span className="text-[10px] text-rose-500 font-semibold block pl-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormDateTimePicker;
