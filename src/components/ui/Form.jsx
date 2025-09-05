import React from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { FormProvider } from '../../contexts/FormContext';

export const Form = ({ form, onSubmit, children, className = '', }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    form.handleSubmit(onSubmit);
  };

  return (
    <FormProvider form={form}>
      <form onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    </FormProvider>
  );
};

const FormField = ({ 
  name, 
  label, 
  type = 'text', 
  required = false, 
  placeholder,
  options = [], // for select
  className = '',
  ...props 
}) => {
  const { values, errors, touched, handleChange, handleBlur } = useFormContext();
  
  const hasError = touched[name] && errors[name];
  
  const baseInputClass = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    hasError ? 'border-red-500' : 'border-gray-300'
  } ${className}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={values[name] || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={baseInputClass}
            {...props}
          >
            <option value="">-- Chọn {label.toLowerCase()} --</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            name={name}
            value={values[name] || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`${baseInputClass} resize-none`}
            rows={4}
            {...props}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={name}
              checked={values[name] || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...props}
            />
            <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );
      
      default:
        return (
          <input
            type={type}
            name={name}
            value={values[name] || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={baseInputClass}
            {...props}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className="mb-4">
        {renderInput()}
        {hasError && (
          <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {hasError && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );
};