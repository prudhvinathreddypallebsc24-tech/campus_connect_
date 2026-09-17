/**
 * Message.jsx
 * Campus Connect — CS3301 Experiment 4
 *
 * Reusable message / alert component.
 * Renders success or error messages driven by application state.
 * Uses aria-live so screen readers announce updates automatically.
 */

const Message = ({ type, text }) => {
  if (!text) return null;

  return (
    <div
      className={`message message--${type}`}
      role="alert"
      aria-live="polite"
    >
      <span className="message-icon" aria-hidden="true">
        {type === 'success' ? '✅' : '⚠️'}
      </span>
      <span className="message-text">{text}</span>
    </div>
  );
};

export default Message;
