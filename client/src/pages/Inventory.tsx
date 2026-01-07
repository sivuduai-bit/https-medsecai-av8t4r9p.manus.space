import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, Search, Plus, Edit, Trash2, Network, Shield, MapPin, Calendar, Cpu, HardDrive } from "lucide-react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useMemo, useState } from "react";

// Demo inventory data
const INVENTORY_DEVICES = [
  { id: 1, name: "MRI Scanner #1", manufacturer: "Siemens", model: "MAGNETOM Vida", serialNumber: "SN-MRI-001", type: "imaging", classification: "Class III", segment: "Radiology", location: "Building A, Floor 2", firmware: "v3.2.1", lastScan: "2024-12-15", status: "active" },
  { id: 2, name: "CT Scanner #1", manufacturer: "GE Healthcare", model: "Revolution CT", serialNumber: "SN-CT-001", type: "imaging", classification: "Class III", segment: "Radiology", location: "Building A, Floor 2", firmware: "v2.8.0", lastScan: "2024-12-15", status: "active" },
  { id: 3, name: "Patient Monitor #1", manufacturer: "Philips", model: "IntelliVue MX800", serialNumber: "SN-PM-001", type: "monitoring", classification: "Class II", segment: "ICU", location: "Building B, Floor 3", firmware: "v4.1.2", lastScan: "2024-12-14", status: "active" },
  { id: 4, name: "Patient Monitor #2", manufacturer: "Philips", model: "IntelliVue MX800", serialNumber: "SN-PM-002", type: "monitoring", classification: "Class II", segment: "ICU", location: "Building B, Floor 3", firmware: "v4.1.2", lastScan: "2024-12-14", status: "maintenance" },
  { id: 5, name: "Infusion Pump #1", manufacturer: "Baxter", model: "Sigma Spectrum", serialNumber: "SN-IP-001", type: "infusion", classification: "Class II", segment: "General Ward", location: "Building C, Floor 1", firmware: "v6.05.13", lastScan: "2024-12-13", status: "active" },
  { id: 6, name: "Infusion Pump #2", manufacturer: "Baxter", model: "Sigma Spectrum", serialNumber: "SN-IP-002", type: "infusion", classification: "Class II", segment: "General Ward", location: "Building C, Floor 1", firmware: "v6.05.13", lastScan: "2024-12-13", status: "active" },
  { id: 7, name: "Ventilator #1", manufacturer: "Dräger", model: "Evita V500", serialNumber: "SN-VT-001", type: "therapeutic", classification: "Class III", segment: "ICU", location: "Building B, Floor 3", firmware: "v2.n.1", lastScan: "2024-12-12", status: "active" },
  { id: 8, name: "X-Ray Machine #1", manufacturer: "Canon Medical", model: "Aquilion ONE", serialNumber: "SN-XR-001", type: "imaging", classification: "Class II", segment: "Radiology", location: "Building A, Floor 1", firmware: "v7.0", lastScan: "2024-12-11", status: "inactive" },
  { id: 9, name: "Defibrillator #1", manufacturer: "Zoll", model: "R Series", serialNumber: "SN-DF-001", type: "therapeutic", classification: "Class III", segment: "Emergency", location: "Building D, Floor 1", firmware: "v11.1.0", lastScan: "2024-12-10", status: "active" },
  { id: 10, name: "Lab Analyzer #1", manufacturer: "Roche", model: "cobas 8000", serialNumber: "SN-LA-001", type: "laboratory", classification: "Class II", segment: "Laboratory", location: "Building E, Floor 1", firmware: "v3.4.2", lastScan: "2024-12-09", status: "active" }
];

const NETWORK_SEGMENTS = [
  { name: "Radiology", devices: 3, subnet: "192.168.1.0/24", vlan: 10 },
  { name: "ICU", devices: 3, subnet: "192.168.2.0/24", vlan: 20 },
  { name: "General Ward", devices: 2, subnet: "192.168.3.0/24", vlan: 30 },
  { name: "Emergency", devices: 1, subnet: "192.168.4.0/24", vlan: 40 },
  { name: "Laboratory", devices: 1, subnet: "192.168.5.0/24", vlan: 50 }
];

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSegment, setFilterSegment] = useState("all");
  const [selectedDevice, setSelectedDevice] = useState<typeof INVENTORY_DEVICES[0] | null>(null);

  // Device type distribution chart
  const typeDistOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      textStyle: { color: '#e2e8f0' }
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: INVENTORY_DEVICES.filter(d => d.type === 'imaging').length, name: 'Imaging', itemStyle: { color: '#3b82f6' } },
        { value: INVENTORY_DEVICES.filter(d => d.type === 'monitoring').length, name: 'Monitoring', itemStyle: { color: '#22c55e' } },
        { value: INVENTORY_DEVICES.filter(d => d.type === 'therapeutic').length, name: 'Therapeutic', itemStyle: { color: '#a855f7' } },
        { value: INVENTORY_DEVICES.filter(d => d.type === 'infusion').length, name: 'Infusion', itemStyle: { color: '#f97316' } },
        { value: INVENTORY_DEVICES.filter(d => d.type === 'laboratory').length, name: 'Laboratory', itemStyle: { color: '#06b6d4' } }
      ],
      label: { color: '#94a3b8' },
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
    }]
  }), []);

  // Classification distribution
  const classDistOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      textStyle: { color: '#e2e8f0' }
    },
    grid: { top: 20, right: 20, bottom: 30, left: 80 },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } }
    },
    yAxis: {
      type: 'category',
      data: ['Class I', 'Class II', 'Class III'],
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#94a3b8' }
    },
    series: [{
      type: 'bar',
      data: [
        { value: INVENTORY_DEVICES.filter(d => d.classification === 'Class I').length, itemStyle: { color: '#22c55e' } },
        { value: INVENTORY_DEVICES.filter(d => d.classification === 'Class II').length, itemStyle: { color: '#eab308' } },
        { value: INVENTORY_DEVICES.filter(d => d.classification === 'Class III').length, itemStyle: { color: '#ef4444' } }
      ],
      barWidth: 20
    }]
  }), []);

  const filteredDevices = INVENTORY_DEVICES.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || device.type === filterType;
    const matchesSegment = filterSegment === "all" || device.segment === filterSegment;
    return matchesSearch && matchesType && matchesSegment;
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      active: "badge-success",
      maintenance: "badge-medium",
      inactive: "badge-critical"
    };
    return <Badge className={`${config[status] || config.inactive} border`}>{status}</Badge>;
  };

  const getClassBadge = (classification: string) => {
    const config: Record<string, string> = {
      "Class I": "bg-green-500/20 text-green-400 border-green-500/30",
      "Class II": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Class III": "bg-red-500/20 text-red-400 border-red-500/30"
    };
    return <Badge className={`${config[classification] || config["Class I"]} border`}>{classification}</Badge>;
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Server className="h-7 w-7 text-primary" />
            Device Inventory
          </h1>
          <p className="text-muted-foreground mt-1">
            Medical device classification, metadata, and network organization
          </p>
        </div>
        <Button className="cyber-glow">
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Devices", value: INVENTORY_DEVICES.length, icon: Server },
          { label: "Active", value: INVENTORY_DEVICES.filter(d => d.status === 'active').length, icon: Shield },
          { label: "Network Segments", value: NETWORK_SEGMENTS.length, icon: Network },
          { label: "Class III Devices", value: INVENTORY_DEVICES.filter(d => d.classification === 'Class III').length, icon: Cpu }
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-secondary">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Device Types</CardTitle>
            <CardDescription>Distribution by device category</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={typeDistOptions} style={{ height: '250px' }} />
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Risk Classification</CardTitle>
            <CardDescription>Devices by TGA classification</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={classDistOptions} style={{ height: '250px' }} />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Devices and Segments */}
      <Tabs defaultValue="devices">
        <TabsList className="bg-secondary">
          <TabsTrigger value="devices">Device List</TabsTrigger>
          <TabsTrigger value="segments">Network Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="mt-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">All Devices</CardTitle>
                  <CardDescription>Complete inventory of medical devices</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search devices..." 
                      className="pl-9 w-64 bg-secondary border-border/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-36 bg-secondary border-border/50">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="imaging">Imaging</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="therapeutic">Therapeutic</SelectItem>
                      <SelectItem value="infusion">Infusion</SelectItem>
                      <SelectItem value="laboratory">Laboratory</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterSegment} onValueChange={setFilterSegment}>
                    <SelectTrigger className="w-40 bg-secondary border-border/50">
                      <SelectValue placeholder="Segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Segments</SelectItem>
                      {NETWORK_SEGMENTS.map(seg => (
                        <SelectItem key={seg.name} value={seg.name}>{seg.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Device</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Manufacturer</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Classification</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Segment</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDevices.map((device) => (
                      <tr 
                        key={device.id} 
                        className="border-t border-border/30 hover:bg-secondary/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedDevice(device)}
                      >
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-xs text-muted-foreground">{device.model}</p>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">{device.manufacturer}</td>
                        <td className="p-3">{getClassBadge(device.classification)}</td>
                        <td className="p-3 text-muted-foreground">{device.segment}</td>
                        <td className="p-3">{getStatusBadge(device.status)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="mt-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Network Segments</CardTitle>
              <CardDescription>Logical network organization for medical devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {NETWORK_SEGMENTS.map((segment) => (
                  <Card key={segment.name} className="bg-secondary/30 border-border/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Network className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="secondary">VLAN {segment.vlan}</Badge>
                      </div>
                      <h3 className="font-medium mt-3">{segment.name}</h3>
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Devices</span>
                          <span className="font-medium">{segment.devices}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subnet</span>
                          <span className="font-mono text-xs">{segment.subnet}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Device Detail Dialog */}
      {selectedDevice && (
        <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle>{selectedDevice.name}</DialogTitle>
              <DialogDescription>{selectedDevice.manufacturer} - {selectedDevice.model}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Serial Number</p>
                  <p className="font-mono">{selectedDevice.serialNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Classification</p>
                  <div className="mt-1">{getClassBadge(selectedDevice.classification)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Device Type</p>
                  <p className="capitalize">{selectedDevice.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Firmware Version</p>
                  <p className="font-mono">{selectedDevice.firmware}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Network Segment</p>
                  <p>{selectedDevice.segment}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedDevice.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Security Scan</p>
                  <p className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {selectedDevice.lastScan}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedDevice.status)}</div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
