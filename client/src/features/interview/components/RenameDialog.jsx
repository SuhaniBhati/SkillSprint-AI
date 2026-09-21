import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2 } from "lucide-react";

/**
 * Centered modal for renaming a report. Purely presentational except for
 * the local input value; submission is delegated via onSave.
 */
export default function RenameDialog({ isOpen, onClose, initialTitle, onSave, isSaving }) {
  const [title, setTitle] = useState(initialTitle || "");

  useEffect(() => {
    if (isOpen) setTitle(initialTitle || "");
  }, [isOpen, initialTitle]);

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#1F1F1F]/40 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <Dialog.Title className="text-lg font-semibold text-[#1F1F1F]">
                Rename Interview Report
              </Dialog.Title>

              <input
                autoFocus
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSave()}
                placeholder="Enter a new title"
                className="mt-4 w-full rounded-xl border border-[#ECE5EA] bg-[#FAF8FB] px-4 py-3 text-sm text-[#1F1F1F] outline-none transition focus:border-[#C74D81] focus:ring-4 focus:ring-[#EAA7C4]/30"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-4 py-2.5 text-sm font-semibold text-[#666666] transition hover:bg-[#FAF8FB]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !title.trim()}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#970747] to-[#D65795] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving && <Loader2 size={15} className="animate-spin" />}
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}