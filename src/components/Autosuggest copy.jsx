import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

const AutosuggestField = ({
  suggestions,
  onSuggestionsFetchRequested,
  onSuggestionsClearRequested,
  getSuggestionValue,
  renderSuggestion,
  inputProps
}) => {
  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
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
