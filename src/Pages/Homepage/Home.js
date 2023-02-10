import React, { useState } from "react";
import Container from "@mui/material/Container";
import SubmitData from "./submitData";
import CredTable from "./CredTable";

const Home = () => {
  // const [response, setResponse] = useState("");

  const [pageState, setState] = useState({
    ppidInput: "",
    response: [], // not sure if this is right...
  });

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...pageState,
      [evt.target.name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // setResponse(sampleResponseObject); // just using this object to test the frontend

    function splitText(text) {
      // Use a regular expression to match spaces, tabs, and new lines
      let regex = /[ \t\n,]+/;
      // Split the text using the regular expression
      let words = text.split(regex);

      return words.filter((word) => word.length >= 2);
    }

    // Get the value of the text input field
    // const text = event.target.elements.text.value;
    let text = pageState.ppidInput;

    const ppidArray = splitText(text);

    // Use fetch to send the text to the server
    fetch("/api/lookup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ppidArray }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Update the response state with the server response
        console.log("response from server", data);
        setState({ ...pageState, response: data });
      });
  };

  const propsToInput = {
    pageState,
    handleChange,
    handleSubmit,
  };

  return (
    <Container maxWidth="xl">
      <SubmitData {...propsToInput} />
      {pageState.response.length > 0 && (
        <CredTable data={pageState.response}></CredTable>
      )}
    </Container>
  );
};

export default Home;
