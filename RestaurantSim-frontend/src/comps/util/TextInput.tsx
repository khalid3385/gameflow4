type FormCard = {
  labelContent: string;
  errorContent: string;
};

const TextInput = ({ labelContent, errorContent, ...props }) => {
  let final_class =
    (props?.className || " ") + ` h-10 border border-1 border-neutral-300 `;

  if (!final_class.includes("px") && !final_class.includes("p-"))
    final_class += " px-3";
  if (!final_class.includes("py") && !final_class.includes("p-"))
    final_class += " py-1.5";
  if (!final_class.includes("rounded")) final_class += " rounded-md ";

  return (
    <div className="flex flex-col">
      {labelContent && <label className="mb-1.5 font-medium">{labelContent}</label>}
      <input {...props} className={final_class} type="text" />
      {errorContent && <p className="text-red-500  text-[smaller]">{errorContent}</p>}
    </div>
  );
};

export default TextInput;
