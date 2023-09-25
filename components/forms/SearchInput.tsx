import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";

type Props = {
  filter: any;
  setFilter: any;
  placeholder: string;
  className: string;
  classNamePrefix: string;
};

export const SearchInput = ({
  filter,
  setFilter,
  placeholder,
  className,
  classNamePrefix,
}: Props) => {
  const [value, setValue] = useState(filter);
  let inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(e: any) {
    setValue(e.target.value);
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    setFilter(value);
    // setValue("");
  }

  const handleDeleteSearch = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setValue(inputRef.current.value);
      setFilter(inputRef.current.value);
    }
    // console.log(inputRef.current?.value, 'input')
  }, []);

  useEffect(() => {
    if (filter) {
      if (inputRef.current) {
        inputRef.current.value = filter;
      }
    }
  }, [filter]);

  console.log({ value, filter, inputRef }, "filter");

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex my-auto items-center relative w-full mr-6 text-gray-500 focus-within:text-primary">
        <div className="relative w-full">
          {filter ? (
            <MdClose
              onClick={handleDeleteSearch}
              className={`absolute z-20 left-3 top-4 hover:cursor-pointer text-gray-5 ${
                classNamePrefix ? classNamePrefix : "w-6 h-6"
              }`}
            />
          ) : (
            <MdSearch
              onClick={handleSubmit}
              className={`absolute left-3 top-4 hover:cursor-pointer text-gray-5 ${
                classNamePrefix ? classNamePrefix : "w-6 h-6"
              }`}
            />
          )}
          <input
            type="text"
            placeholder={placeholder}
            onChange={handleChange}
            ref={inputRef}
            className={`w-full bg-transparent rounded-lg border border-stroke py-4 pl-10 pr-6 outline-none focus:border-primary focus-visible:shadow-none ${className}`}
          />
        </div>
      </form>
    </div>
  );
};
