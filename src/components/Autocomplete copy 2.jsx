import React, { useState } from 'react';

function Autocomplete({ items, name, value, onChange, onSelect }) {
  const [query, setQuery] = useState(value);
  const [filteredItems, setFilteredItems] = useState([]);



  const handleChange = (event) => {
    const { value } = event.target;
    setQuery(value);
    setFilteredItems(
      items.filter((item) => item.toLowerCase().indexOf(value.toLowerCase()) !== -1)
    );
  };

  const handleSelect = (item) => {
    setQuery(item);
    setFilteredItems([]);
    onSelect(item);
  };

  return (
    <div>
      <input type="text" name={name} value={query} onChange={onChange} onClick={handleChange} />
      {filteredItems.length > 0 && (
        <ul>
          {filteredItems.map((item) => (
            <li key={item} onClick={() => handleSelect(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Autocomplete;
