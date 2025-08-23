import { Heading } from "../components/ui/Heading";
import { FaPlus } from "react-icons/fa6";
import { CardGroup } from "./ui-group/CardGroup";
import { Card } from "../components/ui/Card";
import {
  FaCube,
  FaCartShopping,
  FaUsers,
  FaChartColumn,
  FaTableColumns,
  FaArrowRightFromBracket,
  FaRegClock,
  FaTruck,
  FaRegCircleCheck,
  FaRegCircleXmark,
  FaEye,
  FaPenToSquare,
} from "react-icons/fa6";
import { Table } from "../components/ui/Table";
import { SearchInput } from "../components/ui/SearchInput";

export const Orders = () => {
  const cards = [
    { title: "Tổng đơn", content: "6", Icon: {icon: FaCube} },
    { title: "Chờ xử lý", content: "1", Icon: {icon: FaRegClock, color: "text-yellow-700 "} },
    { title: "Đang xử lý", content: "2", Icon: {icon: FaCube, color: "text-purple-700"} },
    { title: "Đang giao", content: "1", Icon: {icon: FaTruck, color: "text-orange-700"} },
    { title: "Hoàn thành", content: "1", Icon: {icon: FaRegCircleCheck , color: "text-green-700"} },
    { title: "Đã huỷ", content: "1", Icon: {icon: FaRegCircleXmark, color: "text-red-700"} },
  ];

  const table = {
    headings: [
      "Mã đơn hàng",
      "Khách hàng",
      "Sản phẩm",
      "Tổng tiền",
      "Trạng thái",
    ],
    data: [
      {
        code: "ORD-2024-001",
        customer: "Nguyễn Văn An",
        product: "Ghế sofa cao cấp",
        total: "15.700.000₫",
        status: "Chờ xác nhận",
      },
      {
        code: "ORD-2024-002",
        customer: "Trần Thị Bình",
        product: "Bộ bàn ăn gỗ sồi 6 ghế",
        total: "8.900.000₫",
        status: "Đã xác nhận",
      },
      {
        code: "ORD-2024-003",
        customer: "Lê Minh Cường",
        product: "Tủ quần áo 3 cánh gỗ tự nhiên ",
        total: "24.200.000₫",
        status: "Đang xử lý",
      },
    ],
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
            Icons={[
              { icon: FaEye },
              { icon: FaPenToSquare, color: "text-green-700" },
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
