import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Gauge, ListChecks } from "lucide-react";
import IdleTimeMonitor from "@/components/IdleTimeMonitor";
import OverProvisioningAdvisor from "@/components/OverProvisioningAdvisor";
import UnusedWarehouseList from "@/components/UnusedWarehouseList";

export default function WarehouseEfficiency() {
  const [timeWindow, setTimeWindow] = useState("7days");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Warehouse Efficiency</h1>
        <Select value={timeWindow} onValueChange={setTimeWindow}>
          <SelectTrigger className="w-[180px] bg-slate-800 text-white border-slate-700">
            <SelectValue placeholder="Select Time Window" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 text-white border-slate-700">
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="15days">Last 15 Days</SelectItem>
            <SelectItem value="20days">Last 20 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Idle Time Monitor */}
      <Card className="bg-slate-900 border-slate-800 shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 pb-4">
          <Activity className="text-blue-400" size={20} />
          <CardTitle className="text-white">Idle Time Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <IdleTimeMonitor timeWindow={timeWindow} />
        </CardContent>
      </Card>

      {/* Over-Provisioning Advisor */}
      <Card className="bg-slate-900 border-slate-800 shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 pb-4">
          <Gauge className="text-green-400" size={20} />
          <CardTitle className="text-white">Over-Provisioning Advisor</CardTitle>
        </CardHeader>
        <CardContent>
          <OverProvisioningAdvisor timeWindow={timeWindow} />
        </CardContent>
      </Card>

      {/* Unused Warehouse List */}
      <Card className="bg-slate-900 border-slate-800 shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 pb-4">
          <ListChecks className="text-yellow-400" size={20} />
          <CardTitle className="text-white">Unused Warehouse List</CardTitle>
        </CardHeader>
        <CardContent>
          <UnusedWarehouseList timeWindow={timeWindow} />
        </CardContent>
      </Card>
    </div>
  );
}
