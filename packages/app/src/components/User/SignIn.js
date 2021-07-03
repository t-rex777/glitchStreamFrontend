import React, { useState } from "react";
import Base from "./../Base/Base";
import "./user.css";
import { signInUser } from "./helper";
import { useVideo } from "../../video-context/VideoContext";
import { Link, Redirect } from "react-router-dom";
import { setGlitchHeader } from "../../utils";

function SignIn() {
  const { dispatch } = useVideo();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [redirect, setRedirect] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOADING_STYLE", payload: { display: "block" } });
    const data = await signInUser(user);
    try {
      if (data === undefined) {
        dispatch({ type: "LOADING_STYLE", payload: { display: "none" } });
        dispatch({
          type: "TOAST",
          payload: `Wrong credentials`,
        });
        dispatch({ type: "TOAST_STYLE", payload: { display: "block" } });
        return;
      }
      const { user: userDetails, accessToken, refreshToken } = data;
      localStorage.setItem("__rtoken", refreshToken);
      setGlitchHeader(accessToken);
      dispatch({ type: "LOADING_STYLE", payload: { display: "none" } });
      dispatch({ type: "SIGNIN", payload: userDetails });
      dispatch({ type: "PLAYLIST", payload: userDetails.playlists });
      dispatch({ type: "HISTORY", payload: userDetails.history });
      dispatch({ type: "LIKED_VIDEOS", payload: userDetails.likedVideos });

      dispatch({
        type: "TOAST",
        payload: `Logged In`,
      });
      dispatch({ type: "TOAST_STYLE", payload: { display: "block" } });

      setRedirect(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Base>
      <div className="content-center">
        {redirect && <Redirect to="/" />}
        <form className="form">
          <h1 className="mb-4">Sign In</h1>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={user.email}
            onChange={handleChange}
            className="form-item mb-2"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={user.password}
            onChange={handleChange}
            className="form-item mb-4"
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-success text-s"
          >
            Sign In
          </button>
        </form>
        <p className="mt-2">
          Don't have an account?{" "}
          <Link className="text-success" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </Base>
  );
}

export default SignIn;
