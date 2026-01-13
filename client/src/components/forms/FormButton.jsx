/**
 * FormButton Component
 *
 * Submit button with loading state.
 */

const FormButton = ({
  isLoading = false,
  loadingText = 'Loading...',
  children,
  type = 'submit',
  onClick
}) => {
  return (
    <button
      type={type}
      className="auth-button"
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};

export default FormButton;
