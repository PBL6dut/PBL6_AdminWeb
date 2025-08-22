export const Card = ({ title, icon, content }) => {
  return (
    <div class="flex flex-col border-2 border-gray-200 justify-between p-4 hover:shadow-lg max-h-48 min-h-36 rounded-lg bg-gray-50 dark:bg-gray-800">
      <div>{title && <p>{title}</p>}</div>
      <div>{content && <p className="text-3xl font-bold">{content}</p>}</div>
    </div>
  );
};
