import { Button } from "./Button";

export const Heading = ({ title, button }) => {
  return (
    <div className="mb-5 h-12 flex justify-between">
      <h2 class="text-3xl font-bold dark:text-white">{title || ""}</h2>
      <div>
        {button && (
          <Button
            variant="green"
            handleClick={button.handleClick || (() => {})}
          >
            <span>
              {button.Icon && <button.Icon className="inline-block mr-2" />}
              {button.context || ""}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};
