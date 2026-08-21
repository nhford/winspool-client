import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

type ToggleProps<T extends string> = {
  item: T;
  options: readonly T[];
  setItem: (value: T) => void;
  labels?: Partial<Record<T, string>>;
};

export default function Toggle<T extends string>({
  item,
  options,
  setItem,
  labels,
}: ToggleProps<T>) {
  const handleChange = (_: unknown, newValue: T | null) => {
    if (newValue != null) {
      setItem(newValue);
    }
  };

  return (
    <div className="my-2">
      <ToggleButtonGroup
        value={item || null}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        {options.map((option) => (
          <ToggleButton key={option} value={option}>
            {labels?.[option] ?? option.toUpperCase()}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
