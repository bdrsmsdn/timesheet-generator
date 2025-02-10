import Select from "react-select";
import { Controller } from "react-hook-form";

const CustomSelect = ({ name, options, isLoading, control, disabled }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => {
      const selectedOption =
        options.find((opt) => opt.value === field.value) || null;

      return (
        <Select
          {...field}
          options={options}
          value={selectedOption}
          onChange={(selected) => field.onChange(selected?.value)}
          isDisabled={disabled || isLoading}
          placeholder={isLoading ? `Loading ${name}...` : `Select ${name}`}
          isLoading={isLoading}
          noOptionsMessage={() => `No ${name} available`}
        />
      );
    }}
  />
);

export default CustomSelect;
