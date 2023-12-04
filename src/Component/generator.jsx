import React, { useState, useEffect } from 'react';
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
  Paper,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';

const DynamicTable = () => {
  const [tableData, setTableData] = useState([
    {
      name: '',
      type: '',
      properties: {},
      dependantOn: [],
      template: null,
    },
  ]);
  const [deletedRows, setDeletedRows] = useState([]);
  const [nameError, setNameError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [repeatError, setRepeatError] = useState({ index: null, name: false });
  const [selectedRegion, setSelectedRegion] = useState('');
  const [regionError, setRegionError] = useState(false);
  const [jsonArray, setJsonArray] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const regions = ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1'];

  const templates = [
    {
      name: "Template1",
      data: {
        "MyTable1": {
          "Type": "AWS::DynamoDB::Table",
          "Properties": {
            "TableName": "MyTable1",
            "AttributeDefinitions": [
              {"AttributeName": "Attribute1", "AttributeType": "S"},
              {"AttributeName": "Attribute2", "AttributeType": "N"},
              {"AttributeName": "Attribute3", "AttributeType": "S"},
              {"AttributeName": "Attribute4", "AttributeType": "S"},
              {"AttributeName": "Attribute5", "AttributeType": "N"}
            ],
            "KeySchema": [
              {"AttributeName": "Attribute1", "KeyType": "HASH"}
            ],
            "ProvisionedThroughput": {
              "ReadCapacityUnits": 5,
              "WriteCapacityUnits": 5
            }
          }
        }
      }
    },
    {
      name: "Template2",
      data: {
        "MyTable2": {
          "Type": "AWS::DynamoDB::Table",
          "Properties": {
            "TableName": "MyTable2",
            "AttributeDefinitions": [
              {"AttributeName": "AttributeA", "AttributeType": "S"},
              {"AttributeName": "AttributeB", "AttributeType": "N"},
              {"AttributeName": "AttributeC", "AttributeType": "S"},
              {"AttributeName": "AttributeD", "AttributeType": "S"},
              {"AttributeName": "AttributeE", "AttributeType": "N"}
            ],
            "KeySchema": [
              {"AttributeName": "AttributeA", "KeyType": "HASH"}
            ],
            "ProvisionedThroughput": {
              "ReadCapacityUnits": 5,
              "WriteCapacityUnits": 5
            }
          }
        }
      }
    },
    {
      name: "Template3",
      data: {
        "MyTable3": {
          "Type": "AWS::DynamoDB::Table",
          "Properties": {
            "TableName": "MyTable3",
            "AttributeDefinitions": [
              {"AttributeName": "Field1", "AttributeType": "S"},
              {"AttributeName": "Field2", "AttributeType": "N"},
              {"AttributeName": "Field3", "AttributeType": "S"},
              {"AttributeName": "Field4", "AttributeType": "S"},
              {"AttributeName": "Field5", "AttributeType": "N"}
            ],
            "KeySchema": [
              {"AttributeName": "Field1", "KeyType": "HASH"}
            ],
            "ProvisionedThroughput": {
              "ReadCapacityUnits": 5,
              "WriteCapacityUnits": 5
            }
          }
        }
      }
    },
    {
      name: "Template4",
      data: {
        "MyTable4": {
          "Type": "AWS::DynamoDB::Table",
          "Properties": {
            "TableName": "MyTable4",
            "AttributeDefinitions": [
              {"AttributeName": "Col1", "AttributeType": "S"},
              {"AttributeName": "Col2", "AttributeType": "N"},
              {"AttributeName": "Col3", "AttributeType": "S"},
              {"AttributeName": "Col4", "AttributeType": "S"},
              {"AttributeName": "Col5", "AttributeType": "N"}
            ],
            "KeySchema": [
              {"AttributeName": "Col1", "KeyType": "HASH"}
            ],
            "ProvisionedThroughput": {
              "ReadCapacityUnits": 5,
              "WriteCapacityUnits": 5
            }
          }
        }
      }
    },
    {
      name: "Template5",
      data: {        
        "MyTable5": {
          "Type": "AWS::DynamoDB::Table",
          "Properties": {
            "TableName": "MyTable5",
            "AttributeDefinitions": [
              {"AttributeName": "FieldA", "AttributeType": "S"},
              {"AttributeName": "FieldB", "AttributeType": "N"},
              {"AttributeName": "FieldC", "AttributeType": "S"},
              {"AttributeName": "FieldD", "AttributeType": "S"},
              {"AttributeName": "FieldE", "AttributeType": "N"}
            ],
            "KeySchema": [
              {"AttributeName": "FieldA", "KeyType": "HASH"}
            ],
            "ProvisionedThroughput": {
              "ReadCapacityUnits": 5,
              "WriteCapacityUnits": 5
            }
          }
        }
      }
    }
  ]
  

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
      properties: {},
      dependantOn: [],
      template: null,
    };
    setTableData([...tableData, newRow]);
    setJsonArray([...tableData, newRow]);
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

    if (!repeatError.name) {
      const updatedJsonArray = jsonArray.map((obj, i) =>
        i === rowIndex ? { ...obj, [columnName]: value } : obj
      );
      setJsonArray(updatedJsonArray);
    }
  };

  const handleDependantOnChange = (rowIndex, newValue) => {
    const newTableData = tableData.map((row, i) => {
      if (i === rowIndex) {
        return { ...row, dependantOn: newValue };
      } else {
        return row;
      }
    });
    setTableData(newTableData);
  };

  const getPreviousNames = (currentIndex) => {
    return tableData.slice(0, currentIndex).map((row) => row.name);
  };

  const isNameRepeated = (name, type, currentIndex) => {
    return tableData
      .slice(0, currentIndex)
      .some((row) => row.name.trim() === name.trim() && row.type === type);
  };

  const handleGenerateTemplate = () => {
    if (selectedRegion === '') {
      setRegionError(true);
    } else {
      setRegionError(false);
      const templateData = [{ region: selectedRegion }, ...jsonArray];
      console.log(templateData);
      // Additional logic for generating the template
      // You can use the templateData for further processing
    }
  };

  const handleOpenPopup = (rowIndex) => {
    setOpenPopup(true);
    setSelectedTemplate(tableData[rowIndex].template);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleTemplateSelection = (template) => {
    setSelectedTemplate(template);
  };

  const handleConfirmTemplate = (rowIndex) => {
    const newTableData = tableData.map((row, i) =>
      i === rowIndex ? { ...row, template: selectedTemplate } : row
    );
    setTableData(newTableData);
    setJsonArray([...newTableData]); // Update JSON array with the selected template
    handleClosePopup();
  };

  useEffect(() => {
    if (tableData.length === 0) {
      addRow();
    }
  }, []);

  useEffect(() => {
    setJsonArray(tableData);
  }, [tableData]);

  return (
    <Box component="div" className="cardout">
      <Paper
        style={{
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body1" mr={1}>
          Region:
        </Typography>
        <Select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          displayEmpty
          error={regionError}
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
        {regionError && (
          <Typography variant="caption" color="error">
            You have to select a region.
          </Typography>
        )}
      </Paper>
      <TableContainer component={Paper} style={{ padding: '16px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Properties</TableCell>
              <TableCell style={{ maxWidth: '300px', width: '300px' }}>Dependant On</TableCell>
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
                      (nameError && row.name.trim() === '') || (repeatError.index === rowIndex && repeatError.name) ? (
                        <Typography variant="caption" color="error">
                          {repeatError.index === rowIndex
                            ? 'The element already was configured.'
                            : 'Please enter a valid name.'}
                        </Typography>
                      ) : (
                        ''
                      )
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenPopup(rowIndex)}
                  >
                    View/Edit
                  </Button>
                </TableCell>
                <TableCell style={{ maxWidth: '300px', width: '300px' }}>
                  {row.type === 'DynamoDB' && (
                    <Autocomplete
                      multiple
                      options={getPreviousNames(rowIndex)}
                      value={row.dependantOn}
                      onChange={(_, newValue) => handleDependantOnChange(rowIndex, newValue)}
                      renderInput={(params) => (
                        <TextField {...params} variant="standard" label="Dependant On" />
                      )}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {rowIndex === tableData.length - 1 ? (
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={addRow}>
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
        <Button variant="contained" color="primary" onClick={handleGenerateTemplate}>
          Generate Template
        </Button>
      </Box>
      <Box mt={2} display="flex" flexDirection="column">
        <Dialog open={openPopup} onClose={handleClosePopup}>
          <DialogTitle>Select Template</DialogTitle>
          <DialogContent>
            <Autocomplete
              options={templates}
              getOptionLabel={(option) => option.name}
              value={selectedTemplate}
              onChange={(_, newValue) => handleTemplateSelection(newValue)}
              renderInput={(params) => <TextField {...params} label="Select Template" />}
            />
            {selectedTemplate && (
              <Box mt={2}>
                <Typography variant="body1">Template Content:</Typography>
                <Typography variant="body2">{JSON.stringify(selectedTemplate.data)}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePopup} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleConfirmTemplate(tableData.length - 1)} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default DynamicTable;
