import React, { useState } from "react";
import { IconButton, TextField } from "@material-ui/core";
import {
  NavSearchFieldButton,
  NavSearchFieldComponent,
} from "./nav-search-field.styles";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

export interface NavSearchFieldProps {
  onSearch: (query: string) => void;
  value: string;
}

const NavSearchField: React.FC<NavSearchFieldProps> = ({
  onSearch,
  value,
}: NavSearchFieldProps) => {
  const [showOnMobile, setShowOnMobile] = useState(false);

  return (
    <>
      <NavSearchFieldButton>
        <IconButton onClick={() => setShowOnMobile((prevState) => !prevState)}>
          <SearchIcon />
        </IconButton>
      </NavSearchFieldButton>
      <NavSearchFieldComponent
        showOnMobile={showOnMobile}
        onBlur={() => setShowOnMobile(false)}
      >
        <TextField
          onChange={(event) => onSearch(event.target.value)}
          size={"small"}
          fullWidth={true}
          className="w-100 search-input"
          placeholder={"Search your notes"}
          value={value}
          InputProps={{
            startAdornment: <SearchIcon fontSize={"small"} className="me-2" />,
            endAdornment: value.length > 0 && (
              <IconButton size={"small"} onClick={() => onSearch("")}>
                <ClearIcon />
              </IconButton>
            ),
              disableUnderline: true
          }}
        />
      </NavSearchFieldComponent>
    </>
  );
};

export default NavSearchField;
