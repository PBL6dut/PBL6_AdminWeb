import { FaBox, FaPlus } from "react-icons/fa6";
import { Button } from "../components/ui/Button";
import { Heading } from "../components/ui/Heading";
import { SearchInput } from "../components/ui/SearchInput";
import { Table } from "../components/ui/Table";
import { GetCustomerColumns } from "../configs/tableConfigs";
import PaginationNav from "../components/ui/PaginationNav";
import { useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { getCustomerStats } from "../configs/cardConfigs";
import { StatisticsCard } from "../components/ui/Card";
import Customer from "../components/ui/modal/detail/Customer";
import { useGetCustomersQuery } from "../services/user.api";

const CustomerPage = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading, error } = useGetCustomersQuery({ page });
  const customers = data?.data || [];
  console.log(customers)
  const stats = getCustomerStats(customers);
  const columns = GetCustomerColumns();
  const { pagination } = data || {};
  console.log(data)

  if (isLoading) {
    // Bạn cũng có thể thêm kiểm tra 'error' ở đây để hiển thị thông báo lỗi
    return <LoadingSpinner />;
  }

  return (
    <>
      <Heading title="Quản lý khách hàng" />
      {stats && (
        <div
          className={`grid grid-cols-2 ${
            stats.length === 1
              ? "xl:grid-cols-1"
              : stats.length === 2
              ? "xl:grid-cols-2"
              : stats.length === 3
              ? "xl:grid-cols-3"
              : stats.length === 4
              ? "xl:grid-cols-4"
              : stats.length === 5
              ? "xl:grid-cols-5"
              : "xl:grid-cols-6"
          } gap-4 mb-4 h-auto`}
        >
          {stats.map((card, index) => (
            <StatisticsCard
              key={index}
              title={card.title}
              Icon={card.Icon}
              content={card.content}
            />
          ))}
        </div>
      )}
      <div className="mb-4 bg-gray-50 p-4">
        <SearchInput placeholder="Tìm kiếm khách hàng, email" />
        <Table data={customers} columns={columns} />
      </div>
      {pagination && (
        <PaginationNav
          totalPages={pagination.totalPages}
          currentPage={pagination.currentPage}
        />
      )}
    </>
  );
};

export default CustomerPage;
