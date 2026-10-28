import ButtonDemo from "@/registry/examples/button-demo"
import DialogDemo from "@/registry/examples/dialog-demo"
import DropdownMenuDemo from "@/registry/examples/dropdown-menu-demo"
import FluidHighlightDemo from "@/registry/examples/fluid-highlight-demo"
import PopoverDemo from "@/registry/examples/popover-demo"
import SelectDemo from "@/registry/examples/select-demo"
import TabsDemo from "@/registry/examples/tabs-demo"
import TooltipDemo from "@/registry/examples/tooltip-demo"

export const examples = {
  button: ButtonDemo,
  dialog: DialogDemo,
  "dropdown-menu": DropdownMenuDemo,
  "fluid-highlight": FluidHighlightDemo,
  popover: PopoverDemo,
  select: SelectDemo,
  tabs: TabsDemo,
  tooltip: TooltipDemo,
} as const

export type ExampleName = keyof typeof examples
