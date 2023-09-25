import Select, {
  IndicatorSeparatorProps,
  SelectInstance,
  components,
} from "react-select";
import React, { FC, useEffect, useRef } from "react";
import { MdArrowDropDown, MdSearch } from "react-icons/md";

import * as IconMd from "react-icons/md";
import * as IconFa from "react-icons/fa";

type IconProps = {
  icon: string;
  className: string;
};

const Icon: FC<IconProps> = ({ icon, className, ...props }) => {
  // @ts-ignore
  const Icon = IconMd[icon] || IconFa[icon]; // Dynamically get the icon component based on the "icon" prop

  if (!Icon) {
    throw new Error(`Invalid icon "${icon}"`);
  }

  return <Icon className={className} {...props} />;
};

type Props = {
  value: any;
  onChange: any;
  options: any;
  error: any;
  placeholder: string;
  formatOptionLabel: any;
  instanceId: string;
  isMulti: boolean;
  isDisabled: boolean;
  className: string;
  classNamePrefix: string;
  customStyles: any;
  icon: string;
  isClearable?: boolean;
  menuIsOpen?: boolean;
};

export default function DropdownSelect({
  value,
  onChange,
  options,
  error,
  placeholder,
  formatOptionLabel,
  instanceId,
  isMulti,
  isDisabled,
  className,
  classNamePrefix,
  customStyles,
  icon,
  isClearable,
  menuIsOpen,
}: Props) {
  const onChangeMulti = (selected: any) => {
    isMulti &&
    selected.length &&
    selected.find((option: any) => option.value === "all")
      ? onChange(options.slice(1))
      : !isMulti
      ? onChange(selected || null)
      : onChange(selected);
  };

  const DropdownIndicator = (p: any) => {
    return (
      <components.DropdownIndicator {...p}>
        {!icon ? (
          <MdArrowDropDown
            className={`transform transition-all duration-700 text-gray-600 w-5 h-5 p-0 ${
              p.isFocused && !p.hasValue ? "-rotate-90" : ""
            }`}
          />
        ) : (
          <Icon
            className="transform transition-all duration-700 text-gray-600 w-5 h-5 p-0"
            icon={icon}
          />
        )}
      </components.DropdownIndicator>
    );
  };

  const NoOptionsMessage = (props: any) => {
    return <components.NoOptionsMessage {...props} />;
  };

  const ref = useRef<SelectInstance>(null);

  useEffect(() => {
    const selectEl = ref.current;
    if (!selectEl) return;
    if (menuIsOpen) selectEl.blur();
    else selectEl.focus();
  }, []);

  return (
    <Select
      ref={ref}
      instanceId={instanceId || "id"}
      components={{ DropdownIndicator, NoOptionsMessage }}
      placeholder={placeholder || "Choose..."}
      isClearable={isClearable}
      defaultValue={value}
      onChange={onChangeMulti}
      options={options}
      isMulti={isMulti}
      value={value}
      className={`w-full font-semibold ${className}`}
      aria-errormessage={error}
      classNamePrefix={classNamePrefix}
      isDisabled={isDisabled}
      formatOptionLabel={formatOptionLabel}
      theme={(theme) => ({
        ...theme,
        borderRadius: 6,
        paddingTop: 0,
        colors: {
          ...theme.colors,
          primary25: "#F5F9FD",
          primary: "#5F59F7",
        },
      })}
      styles={customStyles}
      menuIsOpen={menuIsOpen}
    />
  );
}
