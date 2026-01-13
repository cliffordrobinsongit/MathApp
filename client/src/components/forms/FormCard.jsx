/**
 * FormCard Component
 *
 * Centered card container for auth forms.
 */

const FormCard = ({ title, subtitle, children }) => {
  return (
    <div className="auth-container">
      <div className="auth-form-card">
        {title && <h1 className="auth-title">{title}</h1>}
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default FormCard;
