import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const textareaId = id || label ? label?.toLowerCase().replace(/\s+/g, '-') : undefined;
  
  const textareaClasses = `px-3 py-2 bg-white dark:bg-gray-800 border rounded-md text-sm shadow-sm placeholder-gray-400
    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'}
    ${fullWidth ? 'w-full' : ''}
    ${className}`;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label 
          htmlFor={textareaId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {label}
        </label>
      )}
      <textarea 
        id={textareaId} 
        className={textareaClasses} 
        rows={4}
        {...props} 
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Textarea;