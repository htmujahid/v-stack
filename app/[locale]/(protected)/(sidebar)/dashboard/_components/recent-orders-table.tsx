import { getFormatter, getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const orders = [
  {
    id: "ORD-1042",
    customer: "Olivia Martin",
    email: "olivia.martin@example.com",
    status: "paid",
    amount: 1999,
    date: new Date(Date.UTC(2026, 8, 14)),
  },
  {
    id: "ORD-1041",
    customer: "Jackson Lee",
    email: "jackson.lee@example.com",
    status: "pending",
    amount: 39,
    date: new Date(Date.UTC(2026, 8, 13)),
  },
  {
    id: "ORD-1040",
    customer: "Isabella Nguyen",
    email: "isabella.nguyen@example.com",
    status: "paid",
    amount: 299,
    date: new Date(Date.UTC(2026, 8, 12)),
  },
  {
    id: "ORD-1039",
    customer: "William Kim",
    email: "will@example.com",
    status: "refunded",
    amount: 99,
    date: new Date(Date.UTC(2026, 8, 10)),
  },
  {
    id: "ORD-1038",
    customer: "Sofia Davis",
    email: "sofia.davis@example.com",
    status: "paid",
    amount: 449,
    date: new Date(Date.UTC(2026, 8, 9)),
  },
  {
    id: "ORD-1037",
    customer: "Ethan Brown",
    email: "ethan.brown@example.com",
    status: "pending",
    amount: 129,
    date: new Date(Date.UTC(2026, 8, 8)),
  },
] as const

const statusVariant = {
  paid: "outline",
  pending: "secondary",
  refunded: "destructive",
} as const

async function RecentOrdersTable() {
  const [t, format] = await Promise.all([
    getTranslations("app.dashboard.table"),
    getFormatter(),
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columns.order")}</TableHead>
              <TableHead>{t("columns.customer")}</TableHead>
              <TableHead>{t("columns.status")}</TableHead>
              <TableHead>{t("columns.date")}</TableHead>
              <TableHead className="text-end">{t("columns.amount")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{order.customer}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {order.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[order.status]}>
                    {t(`status.${order.status}`)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format.dateTime(order.date, { dateStyle: "medium" })}
                </TableCell>
                <TableCell className="text-end tabular-nums">
                  {format.number(order.amount, {
                    style: "currency",
                    currency: "USD",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export { RecentOrdersTable }
