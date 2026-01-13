/**
 * FormInput Component
 *
 * Reusable input field with label and error message.
 */

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  autoComplete,
  placeholder
}) => {
  return (
    <div className="auth-form-group">
      <label htmlFor={name} className="auth-label">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`auth-input ${error ? 'auth-input-error' : ''}`}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
      {error && (
        <span className="auth-error-text">{error}</span>
      )}
    </div>
  );
};

export default FormInput;
