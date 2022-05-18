import { StyledButton } from "./Button";

export default () => {
  return (
    <div>
      {Array.from({ length: 1000 }).map((_, i) => (
        <div key={i}>
          dynamic 1 <StyledButton>StyledButton</StyledButton>{" "}
        </div>
      ))}
    </div>
  );
};
