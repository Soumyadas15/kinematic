import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/kinematic/ui/table"

const invoices = [
  { id: "INV-1042", customer: "Northwind", status: "Paid", method: "Card", amount: 1250 },
  { id: "INV-1043", customer: "Globex", status: "Pending", method: "Transfer", amount: 480 },
  { id: "INV-1044", customer: "Initech", status: "Paid", method: "Card", amount: 2100 },
  { id: "INV-1045", customer: "Umbrella", status: "Overdue", method: "Invoice", amount: 760 },
  { id: "INV-1046", customer: "Hooli", status: "Paid", method: "Card", amount: 1890 },
]

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)

export default function TableDemo() {
  return (
    <div className="w-full max-w-xl">
      <Table>
        <TableCaption>Invoices issued in October.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-28">Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
              <TableCell className="font-medium">{invoice.customer}</TableCell>
              <TableCell className="text-muted-foreground">{invoice.status}</TableCell>
              <TableCell className="text-muted-foreground">{invoice.method}</TableCell>
              <TableCell className="text-right tabular-nums">
                {currency.format(invoice.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right tabular-nums">{currency.format(total)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
