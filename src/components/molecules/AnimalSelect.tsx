import { useTranslation } from "react-i18next";
import { LIVESTOCK_ANIMALS, LivestockAnimal } from "@/lib/animals";
import { OptionSelect } from "./OptionSelect";

type AnimalSelectProps = {
  value: LivestockAnimal;
  onChange: (animal: LivestockAnimal) => void;
  /** Species to offer (default: all). */
  animals?: readonly LivestockAnimal[];
  className?: string;
};

/** Controlled species picker for the livestock map preview. */
export function AnimalSelect({ value, onChange, animals = LIVESTOCK_ANIMALS, className }: AnimalSelectProps) {
  const { t } = useTranslation();
  return (
    <OptionSelect
      value={value}
      onChange={onChange}
      label={t("finetune.mapPreview.animalLabel")}
      options={animals.map((animal) => ({ value: animal, label: t(`finetune.mapPreview.animals.${animal}`) }))}
      className={className}
    />
  );
}
