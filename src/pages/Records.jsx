import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import api from "../hooks/api";
import { useAuth } from "../hooks/useAuth";

export const RecordsPage = () => {
  const { logout } = useAuth();
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.get(`/records?offset=${page*pageSize}&limit=${pageSize}`);
        setRecords(response.data.records);
        setTotalCount(response.data.totalCount);
      } catch (error) {
        console.error(error);
        if (error.response.status === 400) {
          console.log("logout!")
          logout();
        }
      }
    };

    fetchRecords();
  }, [page, pageSize]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
      <Container component="main" maxWidth="md">
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <TableContainer component={Paper}>
            <Table aria-label="Records table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Response</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell component="th" scope="row">
                        {record.id}
                      </TableCell>
                      <TableCell align="right">{record.operationResponse}</TableCell>
                      <TableCell align="right">{record.userBalance}</TableCell>
                      <TableCell align="right">{record.amount}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={pageSize}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
      </Container>


  );
};

