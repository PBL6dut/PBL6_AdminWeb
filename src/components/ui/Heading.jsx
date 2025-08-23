import { Button } from "./Button";

export const Heading = ({ title, button }) => {
  return (
    <div className="mb-5 flex justify-between">
      <h2 class="text-3xl font-bold dark:text-white">{title || ""}</h2>
      <div>
        {button && <Button variant="green" Icon={button.Icon || <></>} handleClick={button.handleClick || (() => {})}>
          {button.context || ""}
        </Button>}
      </div>
    </div>
  );
};
