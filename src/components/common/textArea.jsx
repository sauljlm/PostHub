import { useState, useEffect, useMemo } from "react";

const TextArea = ({
  labelText,
  errorText,
  type,
  id,
  name = "name",
  placeholder = "placeholder",
  // This is the function that will set the value of the input in the parent component.
  setValue,
  // This is the value that will trigger the validation function. It is a number that is incremented every time the validation function is called.
  validationTrigger = 0,
  // This is the default validation function, it always returns true. Pass a function that returns true or false to validate the input.
  validationFunction = () => {
    return true;
  },
}) => {
  const [internalValue, setInternalValue] = useState("");
  const [error, setError] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    setError(!validationFunction(internalValue));
  }, [validationTrigger]);

  const handleOnChange = (event) => {
    setInternalValue(event.target.value);
    setValue(event.target.value);
  };

  const handleOnBlur = (event) => {
    setInternalValue(event.target.value);
    setValue(event.target.value);
    setError(!validationFunction(event.target.value));
  };

  return (
    <div>
      {labelText ? <label className="block mb-2 text-gray-500">{labelText}</label> : " "}
      <textarea
        type={type}
        id={id}
        name={name}
        className={`w-full px-3 py-2 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline ${
          error ? "border-red-500 border-2" : "border-gray-400"
        }`}
        placeholder={placeholder}
        onBlur={(event) => handleOnBlur(event)}
        onChange={(event) => handleOnChange(event)}
      ></textarea>
      <div>{error && errorText ? <div className="block mb-[-1rem] text-red-800 text-xs">{errorText}</div> : " "}</div>
    </div>
  );
};
export default TextArea;
