import React from 'react';

function AutosuggestField({ suggestions, onChange, onSuggestionsFetchRequested, onSuggestionsClearRequested, getSuggestionValue, renderSuggestion, inputProps, value }) {

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
        value={value}
        onChange={onChange}
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

export default AutosuggestField;