import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Dispatch, SetStateAction } from "react";

export function AdminstrativeAreaWizard({
  status,
  setStatus,
}: Readonly<{
  status: boolean;
  setStatus: Dispatch<SetStateAction<boolean>>;
}>) {
  return (
    <Dialog open={status} onOpenChange={setStatus}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
