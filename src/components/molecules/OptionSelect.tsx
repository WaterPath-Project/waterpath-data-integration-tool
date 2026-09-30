import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";

export type SelectOption<T extends string> = { value: T; label: string };

type OptionSelectProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectOption<T>[];
  /** Accessible name and placeholder. */
  label: string;
  className?: string;
};

/** Small controlled dropdown used by the map preview controllers (species, month). */
export function OptionSelect<T extends string>({ value, onChange, options, label, className }: OptionSelectProps<T>) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as T)}>
      <SelectTrigger aria-label={label} className={className ?? "h-9 w-40 font-inter text-sm text-wpBlue"}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="cursor-pointer transition-all duration-150 hover:bg-wpGray-100 hover:pl-9 data-[highlighted]:bg-wpGray-200"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
