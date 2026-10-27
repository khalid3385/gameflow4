type FormCard = {
  labelContent: string;
  errorContent: string;
  className?: string;

};

const TextInput = ({ labelContent, errorContent, className, ...rest }: FormCard) => {
  let final_class =
    (className || " ") +
    ` h-10 border border-1 border-neutral-300 
    ${errorContent && "border-red-400! bg-red-100! outline-red-400"}`;

  if (!final_class.includes("px") && !final_class.includes("p-"))
    final_class += " px-3";
  if (!final_class.includes("py") && !final_class.includes("p-"))
    final_class += " py-1.5";
  if (!final_class.includes("rounded")) final_class += " rounded-md ";

  return (
    <div className="flex flex-col">
      {labelContent && (
        <label className="mb-1 opacity-80 text-[smaller]">{labelContent}</label>
      )}
      <input {...rest} className={final_class} type="text" />
      {errorContent && (
        <ErrorMessage errorContent={errorContent}/>
      )}
    </div>
  );
};



export const ErrorMessage = ({errorContent}: {errorContent: string}) => {
  return (
    <div className="flex items-center gap-1.5"> 
          {/* <div className="rounded-full bg-red-200 text-red-400  w-3.5 h-3.5 flex items-center justify-center">
            <p className="text-[0.6rem] font-medium">!</p>
          </div> */}
          <p className="text-red-400 mt-0.5 text-[smaller]">{errorContent}</p>
        </div>
  );
}




export default TextInput;
