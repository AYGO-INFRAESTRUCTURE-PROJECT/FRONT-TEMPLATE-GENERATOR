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
  Modal,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

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
  const [regionError, setRegionError] = useState(false);
  const [jsonArray, setJsonArray] = useState([]);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const regions = ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1'];

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

  const handleOpenTemplatesModal = () => {
    setTemplatesModalOpen(true);
  };

  const handleCloseTemplatesModal = () => {
    setTemplatesModalOpen(false);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    handleCloseTemplatesModal();
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
                  {row.type === 'DynamoDB' && (
                    <Box>
                      <Button variant="outlined" onClick={handleOpenTemplatesModal}>
                        Select Template
                      </Button>
                      <Modal open={templatesModalOpen} onClose={handleCloseTemplatesModal}>
                        <Box
                          sx={{
                            position: 'absolute',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <Typography variant="h6" mb={2}>
                            Select Template
                          </Typography>
                          <Button variant="contained" onClick={() => handleSelectTemplate('Template 1')}>
                            Template 1
                          </Button>
                          <Button variant="contained" onClick={() => handleSelectTemplate('Template 2')}>
                            Template 2
                          </Button>
                          <Button variant="contained" onClick={() => handleSelectTemplate('Template 3')}>
                            Template 3
                          </Button>
                          <Button variant="contained" onClick={() => handleSelectTemplate('Template 4')}>
                            Template 4
                          </Button>
                          <Button variant="contained" onClick={() => handleSelectTemplate('Template 5')}>
                            Template 5
                          </Button>
                        </Box>
                      </Modal>
                    </Box>
                  )}
                </TableCell>
                <TableCell style={{ maxWidth: '300px', width: '300px' }}>
                  <Autocomplete
                    multiple
                    options={tableData.slice(0, rowIndex).map((prevRow) => prevRow.name)}
                    value={tableData[rowIndex].dependantOn}
                    onChange={(e, newValue) => handleDependantOnChange(rowIndex, newValue)}
                    disableCloseOnSelect
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <FormControlLabel
                          control={<Checkbox checked={selected} />}
                          label={option}
                        />
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" label="Dependant On" />
                    )}
                    style={{ maxHeight: '100%', overflowY: 'auto', overflowX: 'hidden' }}
                  />
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
      <Box mt={2} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h6">JSON Array</Typography>
        <pre>{JSON.stringify([{ region: selectedRegion, template: selectedTemplate }, ...jsonArray], null, 2)}</pre>
      </Box>
    </Box>
  );
};

export default DynamicTable;
