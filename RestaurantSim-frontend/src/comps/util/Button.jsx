const Button = ({ children, shadow = "shadow-sm", ...props }) => {
  let final_class =
    (props?.className || " ") +
    ` not-disabled:cursor-pointer h-10 transition-all rounded-lg duration-100`;

  if (!final_class.includes("px") && !final_class.includes("p-"))
    final_class += " px-4";
  if (!final_class.includes("py") && !final_class.includes("p-"))
    final_class += " py-1.5";
  if (!final_class.includes("rounded")) final_class += " rounded-lg ";

  return (
    <button {...props} className={final_class}>
      {children}
    </button>
  );
};

export default Button;
