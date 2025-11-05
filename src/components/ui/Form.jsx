import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { useEffect, useState } from "react";
import { formatImageUrl } from "../../utils";

export const Form = ({ formSchema, onSubmit, initialData = {} }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: initialData,
  });
  const keys = Object.keys(formSchema).filter((key) => key !== "objectType");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
    >
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
              // data={initialData[key] || ""}
            />
            {errors[formSchema[key].name] && (
              <p className="text-red-500 text-sm mt-1">{errors[formSchema[key].name].message}</p>
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
      </div>
    </form>
  );
};

const Label = ({ text }) => {
  return (
    <label className="" for="">
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
  data = "",
}) => {
  return (
    <input
      placeholder={placeholder}
      class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
      type={type}
      // defaultValue={data}
      {...register(name, validation)}
    />
  );
};

const Textarea = ({
  placeholder = "",
  register,
  name,
  validation = {},
  data = "",
}) => {
  return (
    <textarea
      placeholder={placeholder}
      class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
      // defaultValue={data}
      {...register(name, validation)}
    ></textarea>
  );
};

const Select = ({ options, register, name, validation = {}, data = "" }) => {
  return (
    <select
      class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
      {...register(name, validation)}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          // selected={option.value === data}
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
  data = [],
}) => {
  const [previews, setPreviews] = useState(
    data.map((item) => formatImageUrl(item)) || []
  ); // Thay đổi thành mảng để lưu nhiều ảnh preview

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Chuyển FileList thành Array
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    } else {
      setPreviews([]);
    }
  };

  // Dọn dẹp các Object URL để tránh rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

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
        })}
      />
      {previews.length > 0 && ( // Kiểm tra previews.length
        <div className="mt-2 grid grid-cols-3 gap-2">
          {" "}
          {/* Hiển thị nhiều ảnh preview */}
          {previews.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Preview ${index}`}
              className="h-24 w-24 object-cover rounded-md"
            />
          ))}
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
  data,
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
            // data={data || ""}
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
            // data={data || ""}
          />
        );
      case "file":
        return (
          <FileInput
            name={name}
            register={register}
            validation={validation}
            multiple={multiple} // Truyền prop multiple
            // data={data || []}
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
            // data={data || ""}
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
