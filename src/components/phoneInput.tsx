import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputComponentProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PhoneInputComponent: React.FC<PhoneInputComponentProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const handlePhoneChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className="flex items-center">
      <PhoneInput
        country={"br"}
        value={value}
        onChange={handlePhoneChange}
        disabled={disabled}
        inputStyle={{ width: "100%" }}
        buttonStyle={{ borderRadius: "4px 0 0 4px" }}
        containerClass="phone-input-container"
        inputClass="phone-input-field"
        dropdownClass="phone-input-dropdown"
      />
    </div>
  );
};

export default PhoneInputComponent;
