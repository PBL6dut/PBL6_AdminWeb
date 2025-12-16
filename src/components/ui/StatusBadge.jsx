import clsx from "clsx";

const variantClasses = {
  default: "bg-blue-500 dark:bg-blue-900 dark:text-blue-300",
  alternative:
    "bg-gray-500 bg-white border border-gray-200 hover:bg-gray-500 hover:text-blue-700 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
  dark: "bg-gray-500 dark:bg-gray-700 dark:text-gray-300",
  light: "bg-red-500 dark:bg-red-900 dark:text-red-300",
  green: "bg-green-500   dark:bg-green-900 dark:text-green-300",
  bold_green: "bg-green-700   dark:bg-green-900 dark:text-green-300",
  red: "bg-red-500   dark:bg-red-900 dark:text-red-300",
  yellow: "bg-yellow-500  dark:bg-yellow-900 dark:text-yellow-300",
  purple: "bg-purple-500  dark:bg-purple-900 dark:text-purple-300",
};

export const StatusBadge = ({ variant = "default", children, className, ...props }) => {
  return (
    <span
      className={clsx(
        "text-xs text-white font-medium me-2 px-2.5 py-0.5 rounded-full",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
