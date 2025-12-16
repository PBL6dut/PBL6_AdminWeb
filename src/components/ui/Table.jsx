const HeadingRow = ({ heading }) => {
  return (
    <th scope="col" className="p-4 text-[#EDF1D6]">
      {heading}
    </th>
  );
};

const DetailRow = ({ value }) => {
  return <td className="p-4 text-[#40513B] bg-[#EDF1D6]">{value}</td>;
};


export const Table = ({ data, columns }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-2xl font-bold text-center text-red-500">
        Không có dữ liệu
      </div>
    );
  }
  return (
    <div class="relative overflow-x-auto border-[#609966] dark:border-gray-700 rounded-lg">
      <table class="w-full text-md text-left border-2 border-[#609966] rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-[#609966] dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns &&
              columns.map((column, index) => (
                <HeadingRow key={index} heading={column.header} />
              ))}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((row) => (
              <tr
                key={row.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-[#609966]"
              >
                {columns &&
                  columns.map((column, index) => (
                    <DetailRow
                      key={index}
                      value={
                        column.render ? column.render(row) : row[column.key]
                      }
                    />
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
