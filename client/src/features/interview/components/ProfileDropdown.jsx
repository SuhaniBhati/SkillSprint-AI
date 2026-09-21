import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { cn } from "../../../utils/cn";

/**
 * Floating profile menu. Purely presentational - receives user data and an
 * onLogout callback from the page/hook layer, never calls the backend itself.
 *
 * Relies on DashboardHeader not clipping its ancestor chain with
 * overflow-hidden; this component only needs to stay viewport-safe on its
 * own (right-aligned, width-capped on narrow screens).
 */
export default function ProfileDropdown({ user, onLogout }) {
  const initials = (user?.username || user?.email || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/15 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/60">
        {initials}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 scale-95 -translate-y-1"
        enterTo="opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items
          as={motion.div}
          className="absolute right-0 z-30 mt-3 w-64 max-w-[calc(100vw-2rem)] origin-top-right rounded-2xl border border-[#ECE5EA] bg-white/95 p-2 shadow-[0_20px_45px_-15px_rgba(31,31,31,0.25)] backdrop-blur-xl focus:outline-none sm:w-72"
        >
          <div className="flex items-center gap-3 rounded-xl px-3 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#970747] to-[#D65795] text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1F1F1F]">
                {user?.username || "Your account"}
              </p>
              <p className="truncate text-xs text-[#666666]">{user?.email}</p>
            </div>
          </div>

          <div className="my-1 h-px bg-[#ECE5EA]" />

          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={onLogout}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[#FF3B30] transition",
                  active && "bg-red-50"
                )}
              >
                <LogOut size={16} />
                Log out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}