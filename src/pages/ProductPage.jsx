import { FaBox, FaPlus } from "react-icons/fa6";
import { Button } from "../components/ui/Button";
import { Heading } from "../components/ui/Heading";
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetStatisticsQuery,
} from "../services/product.api";
import { SearchInput } from "../components/ui/SearchInput";
import { Table } from "../components/ui/Table";
import { GetProductColumns } from "../configs/tableConfigs";
import PaginationNav from "../components/ui/PaginationNav";
import { useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { getProductStats } from "../configs/cardConfigs";
import { StatisticsCard } from "../components/ui/Card";
import { useContext } from "react";
import ModalContext from "../contexts/ModalContext";
import { OpenProductFormModal } from "../configs/onEditConfigs";
import { buildProductFormData } from "../utils/form.utils";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading, isFetching, error } = useGetProductsQuery({ page });
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();
  const products = data?.data || [];
  const categories = categoriesData;

  const { data: statsData, isLoading: isStatsLoading, error: statsError } = useGetStatisticsQuery();
  console.log(statsData);
  const stats = getProductStats(statsData);

  const columns = GetProductColumns(categories);
  const { pagination } = data || {};
  console.log(pagination);

  const { openModal, closeModal } = useContext(ModalContext);

  const [createProduct, createResult] = useCreateProductMutation();
  const headingButton = {
    context: "Thêm sản phẩm",
    Icon: FaPlus,
    handleClick: () => {
      OpenProductFormModal(
        openModal,
        closeModal,
        null,
        async (formData) => {
          // Logic đã được rút gọn
          const payload = buildProductFormData(formData);
          // Gọi API
          await createProduct(payload)
            .unwrap()
            .then(() => closeModal());
        },
        categories
      );
    },
  };

  if (isLoading || isFetching || isCategoriesLoading || isStatsLoading) {
    // Bạn cũng có thể thêm kiểm tra 'error' ở đây để hiển thị thông báo lỗi
    return <LoadingSpinner />;
  }

  return (
    <>
      <Heading title="Quản lý sản phẩm" button={headingButton} />
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
        <SearchInput placeholder="Tìm kiếm sản phẩm, SKU" />
        <Table data={products} columns={columns} />
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

export default ProductPage;
