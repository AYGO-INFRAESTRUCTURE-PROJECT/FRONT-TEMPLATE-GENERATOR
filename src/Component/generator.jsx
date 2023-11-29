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
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const DynamicTable = () => {
  const [tableData, setTableData] = useState([
    {
      name: '',
      type: '',
      properties: '',
      dependantOn: [],
    },
  ]);
  const [deletedRows, setDeletedRows] = useState([]);
  const [nameError, setNameError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [repeatError, setRepeatError] = useState({ index: null, name: false });
  const [selectedRegion, setSelectedRegion] = useState('');

  const regions = [
    'us-east-1',
    'us-west-1',
    'us-west-2',
    'eu-west-1',
    // Add more AWS regions as needed
  ];

  const addRow = () => {
    const lastRow = tableData[tableData.length - 1];

    if (isNameRepeated(lastRow.name, lastRow.type, tableData.length - 1)) {
      setNameError(true);
      setTypeError(true);
      setRepeatError({ index: tableData.length - 1, name: true });
      return;
    } else {
      setNameError(false);
      setTypeError(false);
      setRepeatError({ index: null, name: false });
    }

    if (lastRow.name.trim() === '' || lastRow.type === '') {
      setNameError(true);
      setTypeError(true);
      return;
    } else {
      setNameError(false);
      setTypeError(false);
    }

    const newRow = {
      name: '',
      type: '',
      properties: '',
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

    if (isNameRepeated(value, newTableData[rowIndex].type, rowIndex)) {
      setRepeatError({ index: rowIndex, name: true });
    } else {
      setRepeatError({ index: null, name: false });
    }
  };

  const getPreviousNames = (currentIndex) => {
    return tableData.slice(0, currentIndex).map((row) => row.name);
  };

  const isNameRepeated = (name, type, currentIndex) => {
    return tableData
      .slice(0, currentIndex)
      .some((row) => row.name.trim() === name.trim() && row.type === type);
  };

  useEffect(() => {
    if (tableData.length === 0) {
      addRow();
    }
  }, []);

  return (
    <Box component="div" className="cardout">
      <Paper style={{ padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" mr={1}>
          Region:
        </Typography>
        <Select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select Region
          </MenuItem>
          {regions.map((region) => (
            <MenuItem key={region} value={region}>
              {region}
            </MenuItem>
          ))}
        </Select>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Properties</TableCell>
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
                    error={nameError && row.name.trim() === ''}
                    helperText={
                      (nameError && row.name.trim() === '') || (repeatError.index === rowIndex && repeatError.name)
                        ? (
                          <Typography variant="caption" color="error">
                            {repeatError.index === rowIndex ? 'The element already was configured.' : 'Please enter a valid name.'}
                          </Typography>
                        ) : ''
                    }
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={row.type}
                    onChange={(e) => updateCell(rowIndex, 'type', e.target.value)}
                    error={typeError && row.type === ''}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select
                    </MenuItem>
                    <MenuItem value="EC2">EC2</MenuItem>
                    <MenuItem value="S3">S3</MenuItem>
                    <MenuItem value="DynamoDB">DynamoDB</MenuItem>
                    <MenuItem value="Lambda">Lambda</MenuItem>
                  </Select>
                  {typeError && row.type === '' && (
                    <div>
                      <Typography variant="caption" color="error" mt={1}>
                        Please select a valid type.
                      </Typography>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={row.properties}
                    onChange={(e) => updateCell(rowIndex, 'properties', e.target.value)}
                  />
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
