import AccordionDemo from "@/registry/examples/accordion-demo"
import AlertDemo from "@/registry/examples/alert-demo"
import AlertDialogDemo from "@/registry/examples/alert-dialog-demo"
import AvatarDemo from "@/registry/examples/avatar-demo"
import BadgeDemo from "@/registry/examples/badge-demo"
import BreadcrumbDemo from "@/registry/examples/breadcrumb-demo"
import ButtonDemo from "@/registry/examples/button-demo"
import CardDemo from "@/registry/examples/card-demo"
import CheckboxDemo from "@/registry/examples/checkbox-demo"
import CollapsibleDemo from "@/registry/examples/collapsible-demo"
import CommandDemo from "@/registry/examples/command-demo"
import ContextMenuDemo from "@/registry/examples/context-menu-demo"
import DialogDemo from "@/registry/examples/dialog-demo"
import DrawerDemo from "@/registry/examples/drawer-demo"
import DropdownMenuDemo from "@/registry/examples/dropdown-menu-demo"
import FluidHighlightDemo from "@/registry/examples/fluid-highlight-demo"
import HoverCardDemo from "@/registry/examples/hover-card-demo"
import InputDemo from "@/registry/examples/input-demo"
import InputOtpDemo from "@/registry/examples/input-otp-demo"
import KbdDemo from "@/registry/examples/kbd-demo"
import LabelDemo from "@/registry/examples/label-demo"
import MenubarDemo from "@/registry/examples/menubar-demo"
import NavigationMenuDemo from "@/registry/examples/navigation-menu-demo"
import PaginationDemo from "@/registry/examples/pagination-demo"
import PopoverDemo from "@/registry/examples/popover-demo"
import ProgressDemo from "@/registry/examples/progress-demo"
import RadioGroupDemo from "@/registry/examples/radio-group-demo"
import ScrollAreaDemo from "@/registry/examples/scroll-area-demo"
import SelectDemo from "@/registry/examples/select-demo"
import SeparatorDemo from "@/registry/examples/separator-demo"
import SheetDemo from "@/registry/examples/sheet-demo"
import ShimmerTextDemo from "@/registry/examples/shimmer-text-demo"
import SkeletonDemo from "@/registry/examples/skeleton-demo"
import SliderDemo from "@/registry/examples/slider-demo"
import SonnerDemo from "@/registry/examples/sonner-demo"
import StreamingTextDemo from "@/registry/examples/streaming-text-demo"
import SwitchDemo from "@/registry/examples/switch-demo"
import TableDemo from "@/registry/examples/table-demo"
import TabsDemo from "@/registry/examples/tabs-demo"
import TextRevealDemo from "@/registry/examples/text-reveal-demo"
import TextareaDemo from "@/registry/examples/textarea-demo"
import ToggleDemo from "@/registry/examples/toggle-demo"
import ToggleGroupDemo from "@/registry/examples/toggle-group-demo"
import TooltipDemo from "@/registry/examples/tooltip-demo"
import TypingIndicatorDemo from "@/registry/examples/typing-indicator-demo"

export const examples = {
  accordion: AccordionDemo,
  alert: AlertDemo,
  "alert-dialog": AlertDialogDemo,
  avatar: AvatarDemo,
  badge: BadgeDemo,
  breadcrumb: BreadcrumbDemo,
  button: ButtonDemo,
  card: CardDemo,
  checkbox: CheckboxDemo,
  collapsible: CollapsibleDemo,
  command: CommandDemo,
  "context-menu": ContextMenuDemo,
  dialog: DialogDemo,
  drawer: DrawerDemo,
  "dropdown-menu": DropdownMenuDemo,
  "fluid-highlight": FluidHighlightDemo,
  "hover-card": HoverCardDemo,
  input: InputDemo,
  "input-otp": InputOtpDemo,
  kbd: KbdDemo,
  label: LabelDemo,
  menubar: MenubarDemo,
  "navigation-menu": NavigationMenuDemo,
  pagination: PaginationDemo,
  popover: PopoverDemo,
  progress: ProgressDemo,
  "radio-group": RadioGroupDemo,
  "scroll-area": ScrollAreaDemo,
  select: SelectDemo,
  separator: SeparatorDemo,
  sheet: SheetDemo,
  "shimmer-text": ShimmerTextDemo,
  skeleton: SkeletonDemo,
  slider: SliderDemo,
  sonner: SonnerDemo,
  "streaming-text": StreamingTextDemo,
  switch: SwitchDemo,
  table: TableDemo,
  tabs: TabsDemo,
  "text-reveal": TextRevealDemo,
  textarea: TextareaDemo,
  toggle: ToggleDemo,
  "toggle-group": ToggleGroupDemo,
  tooltip: TooltipDemo,
  "typing-indicator": TypingIndicatorDemo,
} as const

export type ExampleName = keyof typeof examples
