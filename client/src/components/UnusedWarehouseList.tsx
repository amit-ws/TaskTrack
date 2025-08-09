import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Zap } from "lucide-react";

type UnusedRow = {
  name: string;
  computeCreditsUsed: number;
  queryCount: number;
};

const mock: UnusedRow[] = [
  { name: "WH_STAGING", computeCreditsUsed: 150.25, queryCount: 300 },
  { name: "WH_ANALYTICS", computeCreditsUsed: 750.0, queryCount: 5000 },
  { name: "WH_ETL", computeCreditsUsed: 210.1, queryCount: 3000 },
  { name: "WH_ADHOC", computeCreditsUsed: 90.0, queryCount: 1800 },
  { name: "WH_DEV", computeCreditsUsed: 10.0, queryCount: 1000 },
  { name: "WH_UNUSED", computeCreditsUsed: 5.0, queryCount: 0 },
];

function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function UnusedWarehouseList({ timeWindow }: { timeWindow: string }) {
  const maxCredits = Math.max(...mock.map((m) => m.computeCreditsUsed), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Unused Warehouse List</h3>
        <div className="text-sm text-muted-foreground">Window: last {timeWindow} days</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mock.map((r) => {
          const cpm =
            r.queryCount === 0 ? null : r.computeCreditsUsed / r.queryCount;

          const ratioPct = Math.min(100, Math.round((r.computeCreditsUsed / maxCredits) * 100));

          return (
            <Card key={r.name} className="border-gray-100 shadow-sm hover:shadow-md transition">
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Database className="w-4 h-4 text-gray-500" />
                      {r.name}
                    </CardTitle>
                    <div className="mt-1 text-xs text-gray-500">Queries: {r.queryCount}</div>
                  </div>

                  <div className="flex flex-col items-end">
                    <Badge>{fmt(r.computeCreditsUsed)} credits</Badge>
                    <div className="text-xs text-gray-500 mt-1">{cpm === null ? "—" : `${cpm.toFixed(6)}`}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Compact progress visual to show compute usage relative to top consumer */}
                <div className="mb-2 text-xs text-gray-500 flex justify-between">
                  <span>Usage (relative)</span>
                  <span className="font-medium">{ratioPct}%</span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div
                    style={{ width: `${ratioPct}%` }}
                    className={`h-2 rounded-full ${ratioPct > 60 ? "bg-red-400" : "bg-emerald-400"}`}
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Credits / Query</div>
                      <div className="font-medium">{cpm === null ? "NULL" : cpm.toFixed(6)}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">Queries</div>
                    <div className="font-medium">{r.queryCount}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
