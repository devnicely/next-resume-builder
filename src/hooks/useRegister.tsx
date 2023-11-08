import { type ChangeEvent, useState } from "react";

const useRegister = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string[]>([]);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    tempOrgName: "",
    firstName: "",
  });

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value,
    });
    setErrors([]);
    setSuccessMsg([]);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    errors,
    setErrors,
    onChange,
    registerData,
    setIsPasswordFocused,
    isPasswordFocused,
    togglePasswordVisibility,
    showPassword,
    setRegisterData,
    successMsg,
    setSuccessMsg,
    isPasswordValid,
    setIsPasswordValid,
    setShowPassword,
  };
};

export default useRegister;
