const FormInput = (props) => {
  const { label, onChange, id, ...inputProps } = props;
  return (
    <div className="formInput">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...inputProps} onChange={onChange} />
    </div>
  );
};

export default FormInput;
