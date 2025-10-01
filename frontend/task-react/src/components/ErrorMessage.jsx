// ErrorMessage.jsx
import { XIcon } from "./Icons";

export default function ErrorMessage({ errors, onDismiss }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-2">
      <XIcon />
      <div className="flex-1">
        {errors.length === 1 ? (
          <p>{errors[0]}</p>
        ) : (
          <ul className="ml-2 list-disc list-inside">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Dismiss error"
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}