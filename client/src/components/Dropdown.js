import React, {useState} from 'react';
import { Dropdown as BootstrapDropdown, DropdownButton } from 'react-bootstrap';

const Dropdown = ({ options, onSelect, title = "Select an Option", labelKey, valueKey, selectedOption, setSelectedOption }) => {
  

  const handleSelect = (selectedKey) => {
    const selected = options.find((option) => option[valueKey] === selectedKey);
    setSelectedOption(selected);
    onSelect(selectedKey);
  };

  const handleReset = () => {
    setSelectedOption(null);
  };

  return (
    <>
      {selectedOption ? (
        <div onClick={handleReset} style={{ cursor: 'pointer' }}>
          <strong>{selectedOption[labelKey]}</strong>
        </div>
      ) : (
        <DropdownButton
          id="dropdown-basic-button"
          title={title}
          onSelect={handleSelect}
          variant="primary"
        >
          {options.map((option, index) => (
            <BootstrapDropdown.Item key={index} eventKey={option[valueKey]}>
              {option[labelKey]}
            </BootstrapDropdown.Item>
          ))}
        </DropdownButton>
      )}
    </>
  );
};

export default Dropdown;