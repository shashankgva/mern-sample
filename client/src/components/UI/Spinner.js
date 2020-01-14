import React, { Fragment } from "react";
import spinner from "../../assets/images/spinner.gif";
import auth from "../../store/reducers/auth";

export default () => (
  <Fragment>
    <img
      src={spinner}
      style={{ width: "200px", margin: "auto", display: "block" }}
      alt='Loading...'
    />
  </Fragment>
);
