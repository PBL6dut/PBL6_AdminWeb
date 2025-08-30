const HeadingRow = ({ heading }) => {
  return (
    <th scope="col" className="px-6 py-3 text-[#EDF1D6]">
      {heading}
    </th>
  );
};

const DetailRow = ({ value }) => {
  return (
    <td className="px-6 py-4 text-[#40513B] bg-[#EDF1D6]">
      {value}
    </td>
  );
};

export const Table = ({ data, renderActions }) => {
  let headings = [];
  headings = data && data.headings;

  let tableData = [];
  tableData = data && data.data;
  const values = tableData && Object.values(tableData[0]);

  let renderedRows = [];
  renderedRows = data && data.renderedRows;

  return (
    <div class="relative overflow-x-auto border-[#609966] dark:border-gray-700 rounded-lg">
      <table class="w-full text-md text-left border-2 border-[#609966] rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-[#609966] dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headings &&
              headings.map((heading, index) => (
                <HeadingRow key={index} heading={heading} />
              ))}
              <HeadingRow />
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
              >
                {renderedRows(item) && renderedRows(item).map((renderedRow, index) => (
                  <DetailRow key={index} value={renderedRow} />
                ))}
                {renderActions && (
                  <td className="py-4 text-gray-900 bg-[#EDF1D6]">{renderActions(item)}</td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
