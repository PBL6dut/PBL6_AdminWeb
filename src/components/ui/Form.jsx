import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { useEffect, useState } from "react";
import { formatImageUrl } from "../../utils";

export const Form = ({ formSchema, onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({});
  const keys = Object.keys(formSchema);
  const handleFormSubmit = (data) => {
    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} encType="multipart/form-data">
      <div className="mt-4 grid grid-cols-2 gap-4 bg-gray-200 rounded-lg p-4 shadow-sm">
        {keys.map((key) => (
          <div key={key}>
            <FormField
              label={formSchema[key].label}
              type={formSchema[key].type}
              placeholder={formSchema[key].placeholder}
              register={register}
              name={formSchema[key].name}
              validation={formSchema[key].validation}
              options={formSchema[key].options}
              multiple={formSchema[key].multiple || false} // Truyền prop multiple từ schema
              defaultValue={formSchema[key].defaultValue}
            />
            {errors[formSchema[key].name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[formSchema[key].name].message}
              </p>
            )}
          </div>
        ))}
      </div>
      <div class="mt-6 flex justify-center">
        <input
          type="submit"
          value="Xác nhận"
          className="cursor-pointer font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none focus:ring-4 text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        />
        <Button variant="red" onClick={onClose}>
          Hủy
        </Button>
      </div>
    </form>
  );
};

const Label = ({ text }) => {
  return (
    <label className="" htmlFor="">
      {text}
    </label>
  );
};

const Input = ({
  placeholder = "",
  type = "text",
  register,
  name,
  validation = {},
  defaultValue = "",
}) => {
  return (
    <input
      placeholder={placeholder}
      class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
      type={type}
      defaultValue={defaultValue}
      {...register(name, validation)}
    />
  );
};

const Textarea = ({
  placeholder = "",
  register,
  name,
  validation = {},
  defaultValue = "",
}) => {
  return (
    <textarea
      placeholder={placeholder}
      class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
      defaultValue={defaultValue}
      {...register(name, validation)}
    ></textarea>
  );
};

const Select = ({ options, register, name, validation = {}, defaultValue = "" }) => {
  return (
    <select
      className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
      {...register(name, validation)}
      defaultValue={defaultValue}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

const FileInput = ({
  register,
  name,
  validation = {}, // errors được xử lý ở Form.jsx
  multiple = false, // Thêm prop multiple
  defaultValue = [],
}) => {
  // Khởi tạo previews từ data có sẵn (ảnh cũ từ initialData)
  const initialPreviews = Array.isArray(defaultValue) && defaultValue.length > 0
    ? defaultValue.map((item) => {
        // Nếu item là object với url property
        if (typeof item === 'object' && item.url) {
          return formatImageUrl(item.url);
        }
        // Nếu item là string url
        return formatImageUrl(item);
      })
    : [];

  const [previews, setPreviews] = useState(initialPreviews);
  const [hasNewImages, setHasNewImages] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Chuyển FileList thành Array
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
      setHasNewImages(true);
    } else {
      // Nếu không chọn file mới, giữ ảnh cũ
      setPreviews(initialPreviews);
      setHasNewImages(false);
    }
  };

  // Dọn dẹp các Object URL để tránh rò rỉ bộ nhớ (chỉ revoke URL mới tạo)
  useEffect(() => {
    return () => {
      if (hasNewImages) {
        previews.forEach((url) => {
          // Chỉ revoke blob URLs (URL.createObjectURL)
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      }
    };
  }, [previews, hasNewImages]);

  return (
    <div className="">
      <input
        type="file"
        accept="image/*"
        multiple={multiple} // Thêm thuộc tính multiple vào input
        // defaultValue={data}
        className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        {...register(name, {
          ...validation,
          onChange: handleFileChange,
          required: false, // Không bắt buộc khi edit vì đã có ảnh cũ
        })}
      />
      {previews.length > 0 && (
        <div className="mt-2">
          {!hasNewImages && initialPreviews.length > 0 && (
            <p className="text-sm text-gray-600 mb-2">
              Ảnh hiện tại ({previews.length} ảnh):
            </p>
          )}
          {hasNewImages && (
            <p className="text-sm text-green-600 mb-2">
              Ảnh mới được chọn ({previews.length} ảnh):
            </p>
          )}
          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt={`Preview ${index}`}
                  className="h-24 w-24 object-cover rounded-md border-2 border-gray-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FormField = ({
  name,
  label,
  type,
  placeholder = "",
  register,
  validation,
  options = [],
  multiple = false, // Thêm prop multiple
  defaultValue = "",
}) => {
  const getInputField = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            name={name}
            placeholder={placeholder}
            register={register}
            validation={validation}
            defaultValue= {defaultValue}
          />
        );
      case "select":
        return (
          <Select
            name={name}
            placeholder={placeholder}
            register={register}
            validation={validation}
            options={options}
            defaultValue={defaultValue}
          />
        );
      case "file":
        return (
          <FileInput
            name={name}
            register={register}
            validation={validation}
            multiple={multiple} // Truyền prop multiple
            defaultValue={defaultValue}
          />
        );
      default:
        return (
          <Input
            name={name}
            placeholder={placeholder}
            type={type}
            register={register}
            validation={validation}
            defaultValue={defaultValue}
          />
        );
    }
  };

  const InputField = getInputField();

  return (
    <div class="mt-4">
      {label && <Label text={label} />}
      {InputField}
    </div>
  );
};
