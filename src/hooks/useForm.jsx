import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setValue(name, fieldValue);
  }, [setValue]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  }, [values]);

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return;

    let error = '';
    
    // Required validation
    if (rules.required && (!value || String(value).trim() === '')) {
      error = rules.required;
    }
    // Email validation
    else if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = rules.email;
    }
    // Min length validation
    else if (rules.minLength && value && String(value).length < rules.minLength.value) {
      error = rules.minLength.message;
    }
    // Custom validation
    else if (rules.custom && value) {
      const customError = rules.custom(value, values);
      if (customError) error = customError;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  }, [values, validationRules]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {}));

    return isValid;
  }, [values, validationRules, validateField]);

  const handleSubmit = useCallback(async (onSubmit) => {
    const isValid = validateAll();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      // You can set form-level errors here
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateAll]);

  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    reset,
    setValues,
    validateField,
    validateAll
  };
};