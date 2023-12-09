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
  Container,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import { Helmet } from 'react-helmet';
const DynamicTable = () => {
  const [tableData, setTableData] = useState([
    {
      name: '',
      type: '',
      AttributeDefinitions: null,
      KeySchema: null,
      ProvisionedThroughput: null,
      versioned: null,
      vpc: null,
      partition_key: null

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
  const [showTemplatePopup, setShowTemplatePopup] = useState(false);
  const [cleanedTemplateData, setCleanedTemplateData] = useState([]);

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
              { "AttributeName": "Attribute1", "AttributeType": "S" },
              { "AttributeName": "Attribute2", "AttributeType": "N" },
              { "AttributeName": "Attribute3", "AttributeType": "S" },
              { "AttributeName": "Attribute4", "AttributeType": "S" },
              { "AttributeName": "Attribute5", "AttributeType": "N" }
            ],
            "KeySchema": [
              { "AttributeName": "Attribute1", "KeyType": "HASH" }
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
              { "AttributeName": "AttributeA", "AttributeType": "S" },
              { "AttributeName": "AttributeB", "AttributeType": "N" },
              { "AttributeName": "AttributeC", "AttributeType": "S" },
              { "AttributeName": "AttributeD", "AttributeType": "S" },
              { "AttributeName": "AttributeE", "AttributeType": "N" }
            ],
            "KeySchema": [
              { "AttributeName": "AttributeA", "KeyType": "HASH" }
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
              { "AttributeName": "Field1", "AttributeType": "S" },
              { "AttributeName": "Field2", "AttributeType": "N" },
              { "AttributeName": "Field3", "AttributeType": "S" },
              { "AttributeName": "Field4", "AttributeType": "S" },
              { "AttributeName": "Field5", "AttributeType": "N" }
            ],
            "KeySchema": [
              { "AttributeName": "Field1", "KeyType": "HASH" }
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
              { "AttributeName": "Col1", "AttributeType": "S" },
              { "AttributeName": "Col2", "AttributeType": "N" },
              { "AttributeName": "Col3", "AttributeType": "S" },
              { "AttributeName": "Col4", "AttributeType": "S" },
              { "AttributeName": "Col5", "AttributeType": "N" }
            ],
            "KeySchema": [
              { "AttributeName": "Col1", "KeyType": "HASH" }
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
              { "AttributeName": "FieldA", "AttributeType": "S" },
              { "AttributeName": "FieldB", "AttributeType": "N" },
              { "AttributeName": "FieldC", "AttributeType": "S" },
              { "AttributeName": "FieldD", "AttributeType": "S" },
              { "AttributeName": "FieldE", "AttributeType": "N" }
            ],
            "KeySchema": [
              { "AttributeName": "FieldA", "KeyType": "HASH" }
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

  const isEmptyObject = (obj) => {
    return obj === null || (typeof obj === 'object' && Object.keys(obj).length === 0);
  };

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
      AttributeDefinitions: null,
      KeySchema: null,
      ProvisionedThroughput: null,
      versioned: null,
      vpc: null,
      partition_key: null
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

    if (columnName === 'type') {
      const updatedRow = { ...newTableData[rowIndex] };

      if (value === 'EC2') {
        updatedRow.vpc = { name: 'test-vpc' };
      } else {
        updatedRow.vpc = null;
      }

      if (value === 'S3') {
        updatedRow.versioned = true;
      } else {
        updatedRow.versioned = null;
      }

      if (value === 'DYNAMO_DB') {
        updatedRow.partition_key = "ADDRESS";
      } else {
        updatedRow.partition_key = null;
      }

      if (value !== 'DYNAMO_DB') {
        updatedRow.AttributeDefinitions = null;
        updatedRow.KeySchema = null;
        updatedRow.ProvisionedThroughput = null;
      }

      setTableData((prevTableData) =>
        prevTableData.map((row, i) => (i === rowIndex ? updatedRow : row))
      );
    }
  };



  const getPreviousNames = (currentIndex) => {
    return tableData.slice(0, currentIndex).map((row) => row.name);
  };

  const isNameRepeated = (name, type, currentIndex) => {
    return tableData
      .slice(0, currentIndex)
      .some((row) => typeof row.name === 'string' && typeof name === 'string' && row.name.trim() === name.trim() && row.type === type);
  };

  const handleGenerateTemplate = () => {
    if (selectedRegion === '') {
      setRegionError(true);
    } else {
      setRegionError(false);
      const templateData = [
        ...jsonArray.slice(0, jsonArray.length - 1).map(({ Properties, ...rest }) => rest),
      ];
      const cleanedTemplateData = templateData.map((row) => {
        const cleanedRow = {};
        for (let key in row) {
          if (
            row[key] !== null &&
            row[key] !== undefined &&
            (!Array.isArray(row[key]) || row[key].length > 0)
          ) {
            cleanedRow[key] = row[key];
          }
        }
        return cleanedRow;
      });

      const stackName = "STACKX";
      const region = selectedRegion;

      const finalTemplate = {
        stack_name: stackName,
        region: region,
        resources: cleanedTemplateData,
      };

      setCleanedTemplateData(finalTemplate);
      handleShowTemplatePopup();
    }
  };

  const handleSendTemplate = () => {
    const arrayJson = cleanedTemplateData;
    fetch('http://ec2-44-200-239-141.compute-1.amazonaws.com:7000/v1/synth/deployments', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arrayJson),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleShowTemplatePopup = () => {
    setShowTemplatePopup(true);
  };

  const handleCloseTemplatePopup = () => {
    setShowTemplatePopup(false);
  };

  const handleOpenPopup = (rowIndex) => {
    setOpenPopup(true);
    setSelectedTemplate(tableData[rowIndex].Properties);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleTemplateSelection = (template) => {
    setSelectedTemplate(template);
    updateCell(tableData.length - 1, 'Properties', template.data);
  };

  useEffect(() => {
    setJsonArray(tableData);
  }, [tableData]);
  const handleConfirmTemplate = (rowIndex) => {
    let newTableData = [...tableData];

    if (selectedTemplate) {
      const { data } = selectedTemplate;
      const properties = data && data[Object.keys(data)[0]].Properties;

      if (properties) {
        const { AttributeDefinitions, KeySchema, ProvisionedThroughput } = properties;

        newTableData = newTableData.map((row, i) =>
          i === rowIndex
            ? {
              ...row,
              AttributeDefinitions,
              KeySchema,
              ProvisionedThroughput,
              versioned: row.type === 'S3' ? true : null,
              vpc: row.type === 'EC2' ? { name: 'test-vpc' } : null,
            }
            : row
        );
      }
    }

    setTableData(newTableData);
    handleClosePopup();


  };
  return (
    <Container className="centreCont">
      <Helmet>
        <title>Template generator</title>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
      </Helmet>
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
        <TableContainer component={Paper} >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Properties</TableCell>
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
                      <MenuItem value="DYNAMO_DB">DynamoDB</MenuItem>
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
                    {row.type === 'DYNAMO_DB' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenPopup(rowIndex)}
                      >
                        View/Edit
                      </Button>
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
        <Dialog open={showTemplatePopup} onClose={handleCloseTemplatePopup}>
          <DialogTitle>Generated Template</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              <pre>{JSON.stringify(cleanedTemplateData, null, 2)}</pre>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTemplatePopup} color="primary">
              Close
            </Button>
            <Button variant="contained" color="primary" onClick={handleSendTemplate}>
              Send Template
            </Button>
          </DialogActions>
        </Dialog>
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
                  <Typography variant="body2">
                    <pre>{JSON.stringify(selectedTemplate, null, 2)}</pre>
                  </Typography>
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
    </Container>
  );
};

export default DynamicTable;
