/**
 * ErrorAlert Component
 *
 * Server error message display.
 */

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="auth-error-alert">
      {message}
    </div>
  );
};

export default ErrorAlert;
