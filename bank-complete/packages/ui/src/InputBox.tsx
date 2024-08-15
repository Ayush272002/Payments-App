export const InputBox = ({
  label,
  placeholder,
  onChange,
  inputType = "text",
}: {
  label: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  inputType?: string;
}) => {
  return (
    <>
      <div className="text-sm font-medium text-left py-2">{label}</div>
      <input
        type={inputType}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-2 py-1 border rounded border-slate-200"
      />
    </>
  );
};
