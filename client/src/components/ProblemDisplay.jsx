const ProblemDisplay = ({ problem, attemptNumber }) => {
  if (!problem) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{problem.title}</h2>
        <div style={styles.metadata}>
          <span style={styles.badge}>{problem.category}</span>
          <span style={styles.badge}>{problem.difficulty}</span>
        </div>
      </div>

      <div style={styles.problemTextContainer}>
        <p style={styles.problemText}>{problem.problemText}</p>
      </div>

      <div style={styles.footer}>
        <span style={styles.attemptCounter}>
          Attempt {attemptNumber || 1}
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  header: {
    marginBottom: '20px'
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '20px',
    fontWeight: '600',
    color: '#333'
  },
  metadata: {
    display: 'flex',
    gap: '8px'
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  problemTextContainer: {
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    borderLeft: '4px solid #3b82f6',
    marginBottom: '16px'
  },
  problemText: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'monospace'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  attemptCounter: {
    fontSize: '14px',
    color: '#6b7280',
    fontStyle: 'italic'
  }
};

export default ProblemDisplay;
