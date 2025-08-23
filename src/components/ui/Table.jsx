export const Table = ( { data, Icons } ) => {

  let headings = []
  headings = data && data.headings
  
  let tableData = []
  tableData = data && data.data
  const keys = tableData && Object.keys(tableData[0]);
  console.log("keys", keys)

  return (
    <div class="relative overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headings && headings.map((heading, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData && tableData.map((item, index) => (
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
              {keys && keys.map((key, index) => (
                <td key={index} className="px-6 py-4 text-gray-900">{item[key]}</td>
              ))}
              {Icons && Icons.map((Icon, index) => (
                <td key={index} className="px-1 py-4 text-gray-900">
                  <button className="cursor-pointer">
                    <Icon.icon className={`w-4 h-4 ${Icon.color || ""}`} />
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
