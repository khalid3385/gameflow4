const Button = ({ children, shadow = "shadow-sm", ...props }) => {
  const final_class =
    (props?.className || " ") +
    ` not-disabled:cursor-pointer  transition-all  duration-100 px-4 py-1.5 rounded-xl `;


  return (
    <button {...props} className={final_class}>
      {children}
    </button>
  );
};

export const SubmitButton = ({
  disabled,
  text,
  className,
  onClick,
}: {
  disabled?: boolean;
  text: string;
  className?: string;
  onClick?: VoidFunction
}) => {
  return (
    <Button
      onClick={onClick}
      className={`bg-primary not-disabled:hover:bg-primary-hover text-white  ${disabled && "bg-primary/70 cursor-not-allowed"} ` + className}
      type="submit"
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default Button;
