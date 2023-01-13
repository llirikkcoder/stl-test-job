import React, { useState, useEffect } from 'react';

function Autosuggest({ items, name, value, onChange, onSelect }) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : items.filter((item) => item.toLowerCase().slice(0, inputLength) === inputValue);
  };

  const handleChange = (event, { newValue }) => {
    setQuery(newValue);
    onChange(event);
  };

  const handleSelect = (event, { suggestion }) => {
    setQuery(suggestion);
    onSelect(suggestion);
  };


  useEffect(() => {
    setSuggestions(getSuggestions(query));
  }, [query, items]);

  const inputProps = {
    name,
    value: query,
    onChange: handleChange
  };

  return (
    <div>
      <input {...inputProps} />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion) => (
            <li key={suggestion} onClick={(e) => handleSelect(e, { suggestion })}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Autosuggest;
