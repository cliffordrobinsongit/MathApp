/**
 * PracticeHeader Component
 *
 * Header for practice page with title and logout button.
 */

function PracticeHeader({ onLogout }) {
  return (
    <div className="practice-header">
      <h1 className="practice-title">Math Practice</h1>
      <button onClick={onLogout} className="practice-logout-button">
        Logout
      </button>
    </div>
  );
}

export default PracticeHeader;
