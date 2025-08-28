import { Heading } from "../components/ui/Heading";
import { FaPlus } from "react-icons/fa6";
import { Card } from "../components/ui/Card";
import {
  FaUsers,
  FaUserPlus,
  FaRegStar,
  FaCoins,
} from "react-icons/fa6";
import { Table } from "../components/ui/Table";
import { SearchInput } from "../components/ui/SearchInput";
import { IconButton } from "../components/ui/Button";
import { useContext } from "react";
import DataContext from "../contexts/DataContext";
import ModalContext from "../contexts/ModalContext";

export const Users = () => {
  const cards = [
    { title: "Tổng KH", content: "6", Icon: { icon: FaUsers } },
    {
      title: "KH mới",
      content: "1",
      Icon: { icon: FaUserPlus, color: "text-blue-600 " },
    },
    {
      title: "KH thường",
      content: "2",
      Icon: { icon: FaUsers, color: "text-green-600" },
    },
    {
      title: "Khách hàng VIP",
      content: "1",
      Icon: { icon: FaRegStar, color: "text-purple-600" },
    },
    {
      title: "Tổng doanh thu",
      content: "1",
      Icon: { icon: FaCoins, color: "text-orange-600" },
    },
    {
      title: "Giá trị TB/KH",
      content: "1",
      Icon: { icon: FaUsers, color: "text-teal-600" },
    },
  ];

  const { data } = useContext(DataContext);
  const { users } = data || [];

  const table = {
    headings: [
      "Tên khách hàng",
      "Liên hệ",
      "Tổng đơn hàng",
      "Tổng chi tiêu",
      "Đơn gần nhất",
    ],
    data: users,
  };

  const { modals, openModal, closeModal, closeAllModals } =
    useContext(ModalContext);
  const { form, detail, confirm } = modals;

  const handleDelete = () => {
    openModal("confirm", {
      message: "Bạn có chắc chắn muốn xóa khách hàng này?",
      onConfirm: () => alert("Đã xoá khách hàng thành công"),
    });
  };

  return (
    <>
      <Heading title="Quản lý đơn hàng" />
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
        <SearchInput placeholder="Tìm mã đơn, tên khách hàng, SĐT..." />
        {table && (
          <Table
            data={table}
            IconButtons={[
              <IconButton iconType="view" handleClick={handleDelete} />,
              <IconButton iconType="edit" />,
            ]}
          />
        )}
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
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
        <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
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
        <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
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
        <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
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
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
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
        <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
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
        <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
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
        <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
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
      </div>
    </>
  );
};
