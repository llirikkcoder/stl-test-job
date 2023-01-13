import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function AutosuggestField({ suggestions, onSuggestionsFetchRequested, onSuggestionsClearRequested, getSuggestionValue, renderSuggestion, inputProps, value, onChange }) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e, { newValue }) => {
    setInputValue(newValue);
  };

  const handleSuggestionSelected = (e, { suggestion }) => {
    onChange(e, { suggestion });
    setInputValue(suggestion);
  };

  const handleFetchRequest = (event) => {
    onSuggestionsFetchRequested({ value: event.target.value });
  }

  const handleClearRequest = () => {
    onSuggestionsClearRequested();
  }

  return (
    <>
      <input
        {...inputProps}
        // value={value}
        // onChange={handleChange}
        onKeyUp={handleFetchRequest}
        onBlur={handleClearRequest}
      />
      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion}>
            {renderSuggestion(getSuggestionValue(suggestion))}
          </li>
        ))}
      </ul>
    </>
  );
};

AutosuggestField.propTypes = {
  suggestions: PropTypes.array.isRequired,
  onSuggestionsFetchRequested: PropTypes.func.isRequired,
  onSuggestionsClearRequested: PropTypes.func.isRequired,
  getSuggestionValue: PropTypes.func.isRequired,
  renderSuggestion: PropTypes.func.isRequired,
  inputProps: PropTypes.object.isRequired
};

export default AutosuggestField;