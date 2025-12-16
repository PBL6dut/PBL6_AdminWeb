import { Heading } from "../components/ui/Heading";
import { Card, StatisticsCard } from "../components/ui/Card";
import {
  FaCube,
  FaCartShopping,
  FaUsers,
  FaChartColumn,
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
import { useCountProductsQuery, useGetMostProductsByCategoryQuery } from "../services/product.api";
import { useCountOrdersQuery, useGetTotalIncomeQuery } from "../services/order.api";
import { useCountCustomersQuery } from "../services/user.api";
import { formatPrice } from "../utils";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export const Dashboard = () => {
  const { data: productsCount, isLoading: productsCountLoading, error } = useCountProductsQuery(); // Replace with actual data fetching logic
  const { data: ordersCount, isLoading: ordersCountLoading } = useCountOrdersQuery();
  const { data: customersCount, isLoading: customersCountLoading } = useCountCustomersQuery();
  const { data: totalIncome, isLoading: totalIncomeLoading } = useGetTotalIncomeQuery();
  const { data: MostProductsByCategory, isLoading: MostProductsByCategoryLoading } = useGetMostProductsByCategoryQuery();

  const cards = [
    {
      title: "Tổng sản phẩm",
      content: productsCount || "0",
      Icon: { icon: FaCube, color: "text-blue-600" },
    },
    {
      title: "Đơn hàng mới",
      content: ordersCount || "0",
      Icon: { icon: FaCartShopping, color: "text-green-600" },
    },
    {
      title: "Khách hàng",
      content: customersCount || "0",
      Icon: { icon: FaUsers, color: "text-purple-600" },
    },
    {
      title: "Doanh thu",
      content: formatPrice(totalIncome) || "0",
      Icon: { icon: FaChartColumn, color: "text-orange-600" },
    },
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

  const column_chart = MostProductsByCategory?.map((item) => ({
    name: item.name,
    uv: item.total_products,
  }));

  if (productsCountLoading || ordersCountLoading || customersCountLoading || totalIncomeLoading || MostProductsByCategoryLoading) {
    return <LoadingSpinner />;
  }

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
            <StatisticsCard
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
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="uv"
                stroke="#8884d8"
                fill="rgba(47, 79, 79, 1)"
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
              <XAxis dataKey="name" className="text-sm" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="uv" fill="rgba(0, 0, 139, 1)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};
