import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const groupIntoCell = (inputArray, arrayPosition) => {
  let outputText = "";
  for (const [i, credArray] of inputArray.entries()) {
    outputText = outputText.concat(credArray[arrayPosition]);
    if (i != credArray.length - 1) {
      outputText = outputText.concat("\n");
    }
  }
  return outputText;
};

export default function SimpleTable({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>PPID</TableCell>
            <TableCell align="left">Standard Credentials</TableCell>
            <TableCell align="left">Standard Start Dates</TableCell>
            <TableCell align="left">Emergency Credentials</TableCell>
            <TableCell align="left">Emergency Start Dates</TableCell>
            <TableCell align="left">Applications</TableCell>
            <TableCell align="left">Application Status</TableCell>
            <TableCell align="left">Application Status Dates</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.ppid}>
              <TableCell component="th" scope="row" sx={{ whiteSpace: "pre" }}>
                {row.ppid}
                {row.error && "\nError: PPID not found"}
              </TableCell>
              <TableCell sx={{ verticalAlign: "top", whiteSpace: "pre" }}>
                {groupIntoCell(row.standardCredentials, 0)}
              </TableCell>
              <TableCell sx={{ verticalAlign: "top", whiteSpace: "pre" }}>
                {groupIntoCell(row.standardCredentials, 1)}
              </TableCell>
              <TableCell sx={{ verticalAlign: "top", whiteSpace: "pre" }}>
                {groupIntoCell(row.emergencyCredentials, 0)}
              </TableCell>
              <TableCell sx={{ verticalAlign: "top", whiteSpace: "pre" }}>
                {groupIntoCell(row.emergencyCredentials, 1)}
              </TableCell>
              <TableCell sx={{ verticalAlign: "top", whiteSpace: "pre" }}>
                {groupIntoCell(row.applications, 0)}
              </TableCell>
              <TableCell sx={{ verticalAlign: "top", whiteSpace: "pre" }}>
                {groupIntoCell(row.applications, 4)}
              </TableCell>
              <TableCell sx={{ verticalAlign: "top", whiteSpace: "pre" }}>
                {groupIntoCell(row.applications, 2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
