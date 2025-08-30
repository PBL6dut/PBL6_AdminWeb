import { useContext } from "react";
import ResourcePageContext from "../contexts/ResourcePageContext";
import { Heading } from "../components/ui/Heading";
import { Card } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { IconButton } from "../components/ui/Button";
import { SearchInput } from "../components/ui/SearchInput";
import { useLocation } from "react-router-dom";

export const Resource = () => {
  const location = useLocation();
  const path = location.pathname.replace("/dashboard/", "");

  const { context } = useContext(ResourcePageContext);
  if (!context) {
    return <div>Loading...</div>;
  }

  const { heading, cards, table, onDelete, onView } = context;

  return (
    <>
      <Heading title={heading.title} button={heading.button} />

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
                <IconButton
                  iconType="view"
                  handleClick={() => onView({ object: item })}
                />
                <IconButton iconType="edit" />
                {path === "products" && (
                  <IconButton
                    iconType="delete"
                    handleClick={() => onDelete({ object: item })}
                  />
                )}
              </>
            )}
          />
        )}
      </div>
    </>
  );
};
