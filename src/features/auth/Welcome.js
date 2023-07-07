import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "./authSlice";
import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  const user = useSelector(selectCurrentUser);
  const token = localStorage.getItem("token"); // useSelector(selectCurrentToken);

  console.log('token', token, user)
  const welcome = user ? `welcome ${user?.firstName} ${user?.lastName}!` : "Welcome!!!";
  const tokenAbbr = `${token.slice(0, 10)}....`;

  const content = (
    <section className="welcome">
      <h1>{welcome}</h1>
      <p>Token: {tokenAbbr}</p>
      <p>
        <Link to="/blog">Go to the Blog List</Link>
      </p>
    </section>
  );

  return content;
};

export default Welcome;
