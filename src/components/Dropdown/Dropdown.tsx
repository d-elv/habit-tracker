import { useState } from "react";
import "./Dropdown.css";

export const Dropdown = ({
  dropdownSelection,
  onSelectionChange,
}: {
  dropdownSelection: string;
  onSelectionChange: (newSelection: string) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen((previousState) => !previousState);
  };

  const handleAssign = (selection: string) => {
    if (dropdownSelection === selection) {
      setIsDropdownOpen(false);
      return;
    } else {
      onSelectionChange(selection);
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="container">
      <label className="dropdown-label">Filter Habits</label>
      <button className="dropdown-button" onClick={toggleDropdown}>
        <div className="down-facing-arrow"></div>
        <span className="selected-dropdown-option">{dropdownSelection}</span>
      </button>
      {isDropdownOpen && (
        <div className="dropdown-options-list-container">
          <ul className="dropdown-options-list">
            <li
              className="dropdown-list-item"
              onClick={() => {
                handleAssign("Completed");
              }}
            >
              Completed
            </li>
            <li
              className="dropdown-list-item"
              onClick={() => {
                handleAssign("Unfulfilled");
              }}
            >
              Unfulfilled
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
