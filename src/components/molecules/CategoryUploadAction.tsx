import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import { Button } from "../atoms/button";
import { DataCategory } from "@/lib/dataCategories";

type CategoryUploadActionProps = {
  /** Machine name of the category (i18n key for the text). */
  machineName: DataCategory["machineName"];
  upload: NonNullable<DataCategory["upload"]>;
  sessionId: string | null;
};

const extensionOf = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot).toLowerCase();
};

/**
 * Text plus an upload button letting the user replace a category's generated
 * data with their own file (`category.upload`). The file goes to
 * POST /api/data/input/upload as multipart form data under the field `file`.
 * Only files with an allowed extension are sent; previews of the category are
 * refreshed afterwards so the maps show the uploaded data.
 */
export function CategoryUploadAction({ machineName, upload, sessionId }: CategoryUploadActionProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);

  const accept = upload.accept.join(",");
  const acceptLabel = upload.accept.join(", ");

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const params = new URLSearchParams({ session_id: `${sessionId}`, file_id: upload.fileId });
      const body = new FormData();
      body.append("file", file);
      const result = await api.post(`/api/data/input/upload?${params.toString()}`, body);
      return result.data;
    },
    onSuccess: () => {
      toast.success(t("finetune.upload.successMessage"));
      void queryClient.invalidateQueries({ queryKey: ["geodataPreview"] });
      void queryClient.invalidateQueries({ queryKey: ["summarizeInput"] });
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast.error(t("finetune.upload.errorMessage"));
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so choosing the same file again re-triggers onChange.
    event.target.value = "";
    if (!file) return;
    if (!upload.accept.includes(extensionOf(file.name))) {
      toast.error(t("finetune.upload.invalidType", { types: acceptLabel }));
      return;
    }
    setFileName(file.name);
    mutation.mutate(file);
  };

  const isAvailable = sessionId !== null;

  return (
    <div className="flex flex-col gap-4">
      <span className="font-inter text-base text-wpBlue">{t(`dataCategories.${machineName}.upload`)}</span>
      <div className="flex flex-row flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
        <Button
          type="button"
          variant="secondary"
          disabled={!isAvailable || mutation.isPending}
          onClick={() => inputRef.current?.click()}
          className="rounded-[16px] font-inter font-bold text-xs flex gap-2 items-center"
        >
          <UploadIcon />
          {mutation.isPending ? t("finetune.upload.uploading") : t("finetune.upload.button", { types: acceptLabel })}
        </Button>
        {fileName && !mutation.isPending && (
          <span className="font-inter text-xs text-wpBlue">
            {mutation.isSuccess ? t("finetune.upload.uploaded", { name: fileName }) : fileName}
          </span>
        )}
        {!isAvailable && (
          <span className="font-inter text-xs italic text-wpBlue-300">{t("finetune.notAvailable")}</span>
        )}
      </div>
    </div>
  );
}
