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
} from "react-icons/fa6";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const Dashboard = () => {
  const cards = [
    { title: "Tổng sản phẩm", content: "1234", Icon: {icon: FaCube, color: "text-blue-700"} },
    { title: "Đơn hàng mới", content: "5678", Icon: {icon: FaCartShopping, color: "text-green-700"} },
    { title: "Khách hàng", content: "91011", Icon: {icon: FaUsers, color: "text-purple-700"} },
    { title: "Doanh thu", content: "121314", Icon: {icon: FaChartColumn, color: "text-orange-700"} },
  ];

  const area_chart = [
    {
      name: "T1",
      uv: 13,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "T2",
      uv: 15,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "T3",
      uv: 17,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "T4",
      uv: 20,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "T5",
      uv: 23,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "T6",
      uv: 30,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "T7",
      uv: 36,
      pv: 4300,
      amt: 2100,
    },
  ];

  const column_chart = [
    {
      name: "Bàn làm việc",
      uv: 18,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Kệ sách",
      uv: 36,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Giường ngủ",
      uv: 63,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Tủ quần áo",
      uv: 69,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Bàn ăn",
      uv: 96,
      pv: 4800,
      amt: 2181,
    }
  ];

  return (
    <>
      <Heading title="Tổng quan" />
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

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <div className="h-96 p-4 rounded-sm bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 hover:shadow-lg">
          <p className="font-bold mb-4">Biểu đồ doanh thu</p>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart
              width={500}
              height={400}
              data={area_chart}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="uv"
                stroke="#8884d8"
                fill="black"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="h-96 p-4 rounded-sm bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 hover:shadow-lg">
          <p className="font-bold mb-4">Sản phẩm bán chạy</p>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              width={500}
              height={300}
              data={column_chart}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" className="text-sm"/>
              <YAxis />
              <Tooltip />
              <Bar dataKey="uv" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
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
