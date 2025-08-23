export const Card = ({ title, Icon, content }) => {
  return (
    <div class="flex flex-col border-2 border-gray-200 justify-between p-4 hover:shadow-lg max-h-48 min-h-36 rounded-lg bg-gray-50 dark:bg-gray-800">
      <div className="flex justify-between relative">
        {title && <p>{title}</p>}
        {Icon && <Icon.icon className={`${Icon.size || "w-5 h-5"} absolute right-0 top-1 dark:text-gray-500 ${Icon.color || ""}`} />}
      </div>
      <div>
        {content && <p className="inline-block text-3xl font-bold">{content}</p>}
      </div>
    </div>
  );
};
