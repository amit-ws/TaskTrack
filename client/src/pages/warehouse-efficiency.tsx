import { useState } from "react";
import IdleTimeMonitor from "@/components/warehouse-efficiency/IdleTimeMonitor";
import OverProvisioningAdvisor from "@/components/warehouse-efficiency/OverProvisioningAdvisor";
import UnusedWarehouseList from "@/components/warehouse-efficiency/UnusedWarehouseList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function WarehouseEfficiency() {
  const [timeWindow, setTimeWindow] = useState("7");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Warehouse Efficiency</h1>
        <Select value={timeWindow} onValueChange={(value) => setTimeWindow(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time window" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="15">Last 15 days</SelectItem>
            <SelectItem value="20">Last 20 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Efficiency Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="idle">
            <TabsList>
              <TabsTrigger value="idle">Idle Time Monitor</TabsTrigger>
              <TabsTrigger value="over">Over-Provisioning Advisor</TabsTrigger>
              <TabsTrigger value="unused">Unused Warehouse List</TabsTrigger>
            </TabsList>

            <TabsContent value="idle">
              <IdleTimeMonitor timeWindow={timeWindow} />
            </TabsContent>

            <TabsContent value="over">
              <OverProvisioningAdvisor timeWindow={timeWindow} />
            </TabsContent>

            <TabsContent value="unused">
              <UnusedWarehouseList timeWindow={timeWindow} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
