const TextInput = ({
  labelText,
  errorText,
  type = "text",
  id,
  name = "name",
  className,
  placeholder = "placeholder",
  // This is the function that will set the value of the input in the parent component.
  setValue,
  // This is the default validation function, it always returns true. Pass a function that returns true or false to validate the input.
  validationFunction = () => {
    return true;
  },
}) => {

  const handleOnChange = (event) => {
    setValue(event);
    validationFunction(event.target.value)
  };

  const handleOnBlur = (event) => {
    setValue(event);
    validationFunction(event.target.value)
  };

  return (
    <div>
      {labelText ? <label className="block mb-2 text-gray-500">{labelText}</label> : " "}
      <input
        type={type}
        id={id}
        name={name}
        className={className}
        placeholder={placeholder}
        onBlur={(event) => handleOnBlur(event)}
        onChange={(event) => handleOnChange(event)}
      />
      <div>{errorText ? <div className="block mb-[-1rem] text-red-800 text-xs">{errorText}</div> : " "}</div>
    </div>
  );
};
export default TextInput;
