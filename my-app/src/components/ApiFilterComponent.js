import React, { useState } from 'react';

const ApiFilterComponent = () => {
  const [apiInput, setApiInput] = useState('');
  const [base64File, setBase64File] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    Alpha: false,
    Numbers: false,
    Heigh: false,
  });
  const [error, setError] = useState('');
  const [serverResponse, setServerResponse] = useState(null); // Store server response
  const [filteredData, setFilteredData] = useState({}); // Store filtered data

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(apiInput);

      // Call the API
      const res = await fetch("https://backend-1ymp.onrender.com/bfhl", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: parsedInput?.data,
          file_base64: base64File,
        }),
      });

      if (!res.ok) {
        throw new Error('Server response was not ok');
      }

      const res2 = await res.json();
      setServerResponse(res2); // Set server response in the state
      setError('');
    } catch (e) {
      setError('Error: Invalid JSON format or failed to communicate with the server');
    }
  };

  const handleFilter = () => {
    if (!serverResponse) {
      alert('No response to filter. Please submit the form first.');
      return;
    }

    const filterResults = {
      alphabets: [],
      numbers: [],
      highest_lowercase_alphabet: []
    };

    // Apply the filters based on user selection
    if (filterOptions.Alpha && serverResponse?.alphabets) {
      filterResults.alphabets = serverResponse.alphabets.filter(item => /^[a-zA-Z]+$/.test(item));
    }

    if (filterOptions.Numbers && serverResponse?.numbers) {
      filterResults.numbers = serverResponse.numbers.filter(item => !isNaN(item));
    }

    if (filterOptions.Heigh && serverResponse?.highest_lowercase_alphabet) {
      filterResults.highest_lowercase_alphabet = serverResponse.highest_lowercase_alphabet;
    }

    // Set the filtered data
    setFilteredData(filterResults);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilterOptions(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Get the Base64 part of the file
        setBase64File(base64String); // Set Base64 string in state
      };
      reader.readAsDataURL(file); // Convert file to base64 string
    }
  };

  return (
    <div>
      <fieldset style={{ width: '50%' }}>
        <legend>API Input (JSON only)</legend>
        <input
          type="text"
          value={apiInput}
          onChange={(e) => setApiInput(e.target.value)}
          style={{ width: '100%' }}
          placeholder='Enter JSON input here'
        />
      </fieldset>

      <fieldset style={{ width: '50%', marginTop: '20px' }}>
        <legend>Upload File</legend>
        <input
          type="file"
          onChange={handleFileUpload}
          style={{ width: '100%' }}
        />
      </fieldset>

      <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Submit</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ margin: '10px 0' }}>
        <label>Multi Filter</label>
        <div>
          <input
            type="checkbox"
            id="alpha"
            name="Alpha"
            checked={filterOptions.Alpha}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="alpha">Alpha</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="numbers"
            name="Numbers"
            checked={filterOptions.Numbers}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="numbers">Numbers</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="heigh"
            name="Heigh"
            checked={filterOptions.Heigh}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="heigh">Highest Lowercase Alphabet</label>
        </div>
      </div>

      <button onClick={handleFilter} style={{ marginTop: '10px' }}>Apply Filter</button>
      {Object.keys(filteredData).length > 0 && (
        <div>
          <h3>Filtered Response</h3>
          <p>{filteredData?.alphabets!=null && ("Alphabets:")} {filteredData.alphabets.join(', ')}</p>
          <p>Numbers: {filteredData.numbers.join(', ')}</p>
          <p>Highest Lowercase Alphabet: {filteredData.highest_lowercase_alphabet.join(', ')}</p>
        </div>
      )}

      {serverResponse && (
        <div>
          <h3>Server Response</h3>
          <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
        </div>
      )}

      
    </div>
  );
};

export default ApiFilterComponent;
