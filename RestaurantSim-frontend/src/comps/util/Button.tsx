const Button = ({ children, shadow = "shadow-sm", ...props }) => {
  let final_class =
    (props?.className || " ") +
    ` not-disabled:cursor-pointer h-10 transition-all  duration-100`;

  if (!final_class.includes("px") && !final_class.includes("p-"))
    final_class += " px-4";
  if (!final_class.includes("py") && !final_class.includes("p-"))
    final_class += " py-1.5";
  if (!final_class.includes("rounded")) final_class += " rounded-xl ";

  return (
    <button {...props} className={final_class}>
      {children}
    </button>
  );
};

export const SubmitButton = ({
  disabled,
  text,
}: {
  disabled: boolean;
  text: string;
}) => {
  return (
    <Button
      className="bg-neutral-800 hover:bg-neutral-700 text-white h-12 mt-4"
      type="submit"
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default Button;
