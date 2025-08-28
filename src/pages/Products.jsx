import { Heading } from "../components/ui/Heading";
import { FaPlus } from "react-icons/fa6";
import { Card } from "../components/ui/Card";
import {
  FaCube,
  FaCircle,
} from "react-icons/fa6";
import { Table } from "../components/ui/Table";
import { SearchInput } from "../components/ui/SearchInput";
import { IconButton } from "../components/ui/Button";
import { useContext } from "react";
import DataContext from "../contexts/DataContext";
import ModalContext from "../contexts/ModalContext";

export const Products = () => {
  const cards = [
    { title: "Tổng sản phẩm", content: "6", Icon: {icon: FaCube, color: "text-blue-600"} },
    { title: "Đang bán", content: "4", Icon: {icon: FaCircle, color: "text-green-600", size: "w-2 h-2"} },
    { title: "Sắp hết hàng", content: "1", Icon: {icon: FaCircle, color: "text-yellow-400", size: "w-2 h-2"} },
    { title: "Hết hàng", content: "2", Icon: {icon: FaCircle, color: "text-red-600", size: "w-2 h-2"} },
  ];

  const { data, chooseObject, setChooseObject } = useContext(DataContext);
  const { products } = data || [];

  const table = {
    headings: ["Sản phẩm", "Danh mục", "Giá", "Tồn kho", "Trạng thái"],
    data: products
  };

  const { modals, openModal, closeModal, closeAllModals } =
    useContext(ModalContext);
  const { form, detail, confirm } = modals;

  const handleDelete = ( {object} ) => {
    openModal("confirm", {
      message: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      onConfirm: () => {
        alert("Đã xoá sản phẩm thành công")
        closeModal("confirm");
      },
    });
    console.log("handledelete")
    console.log(confirm)
  };

  const handleView = ( {object} ) => {
    openModal("detail", {
      data: object,
      labels: ["Tên", "Danh mục", "Giá", "Số lượng hàng tồn kho", "Trạng thái"],
    });
  };

  return (
    <>
      <Heading
        title="Quản lý sản phẩm"
        button={{ context: "Thêm sản phẩm", Icon: FaPlus }}
      />
      {cards && (
        <div
          className={`grid grid-cols-2 ${
            cards.length === 1
              ? "xl:grid-cols-1"
              : cards.length === 2
              ? "xl:grid-cols-2"
              : cards.length === 3
              ? "xl:grid-cols-3"
              : cards.length === 4
              ? "xl:grid-cols-4"
              : cards.length === 5
              ? "xl:grid-cols-5"
              : "xl:grid-cols-6"
          } gap-4 mb-4 h-auto`}
        >
          {cards.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              Icon={card.Icon}
              content={card.content}
            />
          ))}
        </div>
      )}

      <div className="mb-4 bg-gray-50 p-4">
        <SearchInput placeholder="Tìm kiếm sản phẩm, SKU" />
        {table && (
          <Table
            data={table}
            renderActions={(item) => (
              <>
                <IconButton iconType="view" handleClick={() => handleView({ object: item })} />
                <IconButton iconType="edit" />
                <IconButton iconType="delete" handleClick={() => handleDelete({ object: item })} />
              </>
            )}
          />
        )}
      </div>

      <div class="flex items-center justify-center h-48 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800">
        <p class="text-2xl text-gray-400 dark:text-gray-500">
          <svg
            class="w-3.5 h-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </p>
      </div>
    </>
  );
};
