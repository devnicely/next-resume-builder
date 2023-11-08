import { type ChangeEvent, useState } from "react";

const useLogin = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
    setErrors([]);
  };

  return {
    errors,
    setErrors,
    onChange,
    loginData,
    isLoading,
    setIsLoading,
  };
};

export default useLogin;
