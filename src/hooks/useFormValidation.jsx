export const createValidationRules = (type) => {
  const commonRules = {
    name: {
      required: 'Tên không được để trống',
      minLength: { value: 2, message: 'Tên phải có ít nhất 2 ký tự' }
    },
    email: {
      required: 'Email không được để trống',
      email: 'Email không hợp lệ'
    },
    phone: {
      required: 'Số điện thoại không được để trống',
      custom: (value) => {
        if (!/^[0-9]{10,11}$/.test(value)) {
          return 'Số điện thoại không hợp lệ';
        }
      }
    }
  };

  const typeSpecificRules = {
    user: commonRules,
    product: {
      name: commonRules.name,
      price: {
        required: 'Giá không được để trống',
        custom: (value) => {
          if (isNaN(value) || parseFloat(value) <= 0) {
            return 'Giá phải là số dương';
          }
        }
      },
      category: {
        required: 'Danh mục không được để trống'
      }
    },
    order: {
      customerName: commonRules.name,
      customerEmail: commonRules.email,
      customerPhone: commonRules.phone,
      totalAmount: {
        required: 'Tổng tiền không được để trống'
      }
    }
  };

  return typeSpecificRules[type] || commonRules;
};