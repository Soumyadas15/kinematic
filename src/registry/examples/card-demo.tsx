import { Button } from "@/registry/kinematic/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/kinematic/ui/card"

const usage = [
  { label: "Builds", value: "1,284", limit: "of 2,000" },
  { label: "Bandwidth", value: "68 GB", limit: "of 100 GB" },
  { label: "Seats", value: "9", limit: "of 10" },
]

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Pro plan</CardTitle>
        <CardDescription>Renews on 1 December. $40 per month.</CardDescription>
        <CardAction>
          <Button variant="link" size="sm">
            Change
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {usage.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between text-sm">
            <span className="text-muted-foreground">{row.label}</span>
            <span>
              <span className="font-medium tabular-nums">{row.value}</span>{" "}
              <span className="text-muted-foreground">{row.limit}</span>
            </span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="gap-2 border-t">
        <Button variant="outline" className="flex-1">
          View invoices
        </Button>
        <Button className="flex-1">Upgrade</Button>
      </CardFooter>
    </Card>
  )
}
