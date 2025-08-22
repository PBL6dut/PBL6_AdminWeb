import { Button } from "./Button";

export const Heading = ({ title, buttons }) => {
  return (
    <div className="mb-5 flex justify-between">
      <h2 class="text-3xl font-bold dark:text-white">{title && title}</h2>
      <div>
        {buttons && <Button variant="green" Icon={buttons && buttons.Icon}>
          {buttons && buttons.context}
        </Button>}
      </div>
    </div>
  );
};
