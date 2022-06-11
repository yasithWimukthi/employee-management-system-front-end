import React from "react";
import PropTypes from "prop-types";
import {Chip} from "@mui/material";
import {TextField} from "@mui/material";
import Downshift from "downshift";

export default function TagsInput({...props}) {
    const {
        selectedItem,
        setSelectedItem,
        selectedTags,
        placeholder,
        tags,
        validate,
        ...other
    } = props;
    const [inputValue, setInputValue] = React.useState("");

    function handleKeyDown(event) {
        if (event.ctrlKey && event.key === "Enter") {

            const newSelectedItem = [...selectedItem];
            const duplicatedValues = newSelectedItem.indexOf(
                event.target.value.trim()
            );

            if (duplicatedValues !== -1) {
                setInputValue("");
                return;
            }
            if (!event.target.value.replace(/\s/g, "").length) return;

            newSelectedItem.push(event.target.value.trim());
            setSelectedItem(newSelectedItem);
            setInputValue("");
            validate && validate();
        }
        if (
            selectedItem.length &&
            !inputValue.length &&
            event.key === "Backspace"
        ) {
            setSelectedItem(selectedItem.slice(0, selectedItem.length - 1));
        }

    }

    function handleChange(item) {
        let newSelectedItem = [...selectedItem];
        if (newSelectedItem.indexOf(item) === -1) {
            newSelectedItem = [...newSelectedItem, item];
        }
        setInputValue("");
        setSelectedItem(newSelectedItem);

    }

    const handleDelete = (item) => () => {
        const newSelectedItem = [...selectedItem];
        newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
        setSelectedItem(newSelectedItem);
    };

    function handleInputChange(event) {
        setInputValue(event.target.value);
        validate && validate();

    }

    return (
        <React.Fragment>
            <Downshift
                id="downshift-multiple"
                inputValue={inputValue}
                onChange={handleChange}
                selectedItem={selectedItem}
            >
                {({getInputProps}) => {
                    const {onBlur, onChange, onFocus, ...inputProps} = getInputProps({
                        onKeyDown: handleKeyDown,
                        placeholder,
                    });
                    return (
                        <div>
                            <TextField
                                size="small"
                                sx={{my: "0.5rem"}}
                                InputProps={{
                                    startAdornment: selectedItem.map((item, i) => (
                                        <Chip
                                            key={i}
                                            tabIndex={-1}
                                            label={item}
                                            onDelete={handleDelete(item)}
                                        />
                                    )),
                                    onBlur,
                                    onChange: (event) => {
                                        handleInputChange(event);
                                        onChange(event);

                                    },
                                    onFocus,
                                }}
                                {...other}
                                {...inputProps}
                            />
                        </div>
                    );
                }}
            </Downshift>
        </React.Fragment>
    );
}
TagsInput.defaultProps = {
    tags: [],
};
TagsInput.propTypes = {
    selectedTags: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
};
