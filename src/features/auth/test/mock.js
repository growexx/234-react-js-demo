import { useState } from "react";

export const useForm = () => {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleUserInput = (input) => setUser(input);
  const handlePwdInput = (input) => setPwd(input);
  const handleError = (error) => setErrMsg(error);

  return { user, pwd, errMsg, handleUserInput, handlePwdInput, handleError };
};
