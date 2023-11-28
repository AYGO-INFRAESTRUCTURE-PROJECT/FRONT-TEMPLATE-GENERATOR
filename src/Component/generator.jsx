import React, { useState, useEffect } from 'react';
import '../App.css';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Paper,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const DynamicTable = () => {
  const [tableData, setTableData] = useState([
    {
      name: '',
      type: 'Select', // Change the label for the default option
      dependantOn: [],
    },
  ]);
  const [deletedRows, setDeletedRows] = useState([]);

  const addRow = () => {
    const newRow = {
      name: '',
      type: 'Select', // Change the label for the default option
      dependantOn: [],
    };
    setTableData([...tableData, newRow]);
  };

  const deleteRow = (rowIndex) => {
    const deletedRow = tableData[rowIndex];
    setDeletedRows([...deletedRows, deletedRow]);
    const updatedTableData = tableData.filter((_, i) => i !== rowIndex);
    setTableData(updatedTableData);
  };

  const updateCell = (rowIndex, columnName, value) => {
    const newTableData = tableData.map((row, i) =>
      i === rowIndex ? { ...row, [columnName]: value } : row
    );
    setTableData(newTableData);
  };

  const getPreviousNames = (currentIndex) => {
    return tableData.slice(0, currentIndex).map((row) => row.name);
  };

  // Change the label for the default option in the "Type" select
  const typeOptions = ["Select", "EC2", "S3", "DynamoDB", "Lambda"];

  useEffect(() => {
    // Ensure that there is always at least one row when the component is mounted
    if (tableData.length === 0) {
      addRow();
    }
  }, []); // Empty dependency array to run the effect only once

  return (
    <Box component="div" className="cardout">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Dependant On</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <TextField
                    type="text"
                    value={row.name}
                    onChange={(e) => updateCell(rowIndex, 'name', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={row.type}
                    onChange={(e) => updateCell(rowIndex, 'type', e.target.value)}
                  >
                    {typeOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Box style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {getPreviousNames(rowIndex).map((name) => (
                      <div key={name}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={row.dependantOn.includes(name)}
                              onChange={() => {
                                const updatedDependantOn = row.dependantOn.includes(name)
                                  ? row.dependantOn.filter((n) => n !== name)
                                  : [...row.dependantOn, name];

                                updateCell(rowIndex, 'dependantOn', updatedDependantOn);
                              }}
                            />
                          }
                          label={name}
                        />
                      </div>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  {rowIndex === tableData.length - 1 ? (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={addRow}
                    >
                      Add
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteRow(rowIndex)}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display="flex" justifyContent="center">
        <Button variant="contained" color="primary">
          Generate Template
        </Button>
      </Box>
    </Box>
  );
};

export default DynamicTable;
