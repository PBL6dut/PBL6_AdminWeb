export const Card = ({ children }) => {
  return (
    <div class="flex flex-col border-2 border-gray-200 justify-between p-3 hover:shadow-lg max-h-48 min-h-36 rounded-lg bg-gray-50 dark:bg-gray-800">
      {children}
    </div>
  );
};

export const StatisticsCard = ({ title, Icon, content }) => {
  return (
    <Card>
      <div className="flex justify-between relative">
        {title && <p>{title}</p>}
        {Icon && (
          <Icon.icon
            className={`${
              Icon.size || "w-5 h-5"
            } absolute right-0 top-1 dark:text-gray-500 ${Icon.color || ""}`}
          />
        )}
      </div>
      <div>
        {content && (
          <p className="inline-block text-3xl font-bold">{content}</p>
        )}
      </div>
    </Card>
  );
};

export const InformationCard = ({ title, content }) => {
  if (!title && !content) {
    return null;
  }

  const data = Object.values(content);

  return (
    <Card>
      <div className="text-md">
        {title && <p className="font-bold mb-2 text-center">{title}</p>}
        {data &&
          data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.Icon || null}
              <p className="flex gap-1 text-black dark:text-gray-400">
                {item.label && <span className="font-semibold">{item.label}: </span>}
                {item.value}
              </p>
            </div>
          ))}
      </div>
    </Card>
  );
};