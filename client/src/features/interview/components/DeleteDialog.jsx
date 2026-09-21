import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Loader2, Trash2 } from "lucide-react";

/**
 * Centered confirmation modal for irreversible delete actions.
 */
export default function DeleteDialog({ isOpen, onClose, onConfirm, isDeleting, reportTitle }) {
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
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#FF3B30]">
                <Trash2 size={22} />
              </div>
              <Dialog.Title className="text-lg font-semibold text-[#1F1F1F]">
                Delete Interview Report
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-[#666666]">
                {reportTitle ? (
                  <>
                    Delete <span className="font-medium text-[#1F1F1F]">"{reportTitle}"</span>?
                  </>
                ) : (
                  "Delete this report?"
                )}{" "}
                This action cannot be undone.
              </Dialog.Description>

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
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex items-center gap-2 rounded-full bg-[#FF3B30] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting && <Loader2 size={15} className="animate-spin" />}
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}