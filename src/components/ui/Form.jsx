import { useForm } from "react-hook-form";

const Form = ({ title, children }) => {
  return (
    <div class="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm">
      {children}
    </div>
  );
};

const Title = ({ text }) => {
  return <h2 class="text-2xl font-semibold mb-4 text-black">{text}</h2>;
}

const Input = ({ label }) => {
  return (
    <div class="mt-4">
      <label class="text-black" for="">
        {label}
      </label>
      <input
        placeholder="Your name"
        class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
        type="text"
      />
    </div>
  );
};

const Textarea = ({ label }) => {
  return (
    <div class="mt-4">
        <label class="text-black" for="">
          {label}
        </label>
        <textarea
          placeholder="Your address"
          class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
          id="address"
        ></textarea>
      </div>
  )
}

const Select = ({ label, options}) => {
  return(
    <div class="mt-4">
      <label class="text-black" for="">
            {label}
          </label>
          <select
            class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1"
            id="country"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
    </div>
  )
}

export const ProductForm = ({ object }) => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const onSubmit = data => console.log(data);

  const formSchema = {
    name: { required: "Chưa điền tên sản phẩm", defaultValue: object ? object.name : "" },
    description: { defaultValue: object ? object.description : "" },
    price: { required: "Chưa điền giá sản phẩm", defaultValue: object ? object.price : "" },
    
  }

  return(
    <Form>
      <Title text="Thêm sản phẩm mới" />
      <Input label="Tên sản phẩm" />
      <Input label="Giá sản phẩm" />
      <Textarea label="Mô tả sản phẩm" />
      <Select 
        label="Danh mục"
        options={[
          { value: 'electronics', label: 'Điện tử' },
          { value: 'clothing', label: 'Thời trang' },
          { value: 'home', label: 'Nhà cửa' },
        ]}
      />
    </Form>
  )
}