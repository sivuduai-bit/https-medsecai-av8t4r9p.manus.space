import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Network, Search, RefreshCw, Wifi, WifiOff, AlertTriangle, Server, Monitor, Activity } from "lucide-react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useMemo, useState, useEffect, useRef } from "react";

const DEMO_ORG_ID = 1;

// Demo devices for visualization
const demoDevices = [
  { id: 1, name: "MRI Scanner #1", type: "imaging", status: "online", ip: "192.168.1.10", risk: 25 },
  { id: 2, name: "CT Scanner #1", type: "imaging", status: "online", ip: "192.168.1.11", risk: 15 },
  { id: 3, name: "Patient Monitor #1", type: "monitoring", status: "online", ip: "192.168.1.20", risk: 45 },
  { id: 4, name: "Patient Monitor #2", type: "monitoring", status: "offline", ip: "192.168.1.21", risk: 60 },
  { id: 5, name: "Infusion Pump #1", type: "infusion", status: "online", ip: "192.168.1.30", risk: 35 },
  { id: 6, name: "Infusion Pump #2", type: "infusion", status: "online", ip: "192.168.1.31", risk: 20 },
  { id: 7, name: "Ventilator #1", type: "therapeutic", status: "online", ip: "192.168.1.40", risk: 55 },
  { id: 8, name: "X-Ray Machine #1", type: "imaging", status: "maintenance", ip: "192.168.1.50", risk: 30 },
  { id: 9, name: "Defibrillator #1", type: "therapeutic", status: "online", ip: "192.168.1.60", risk: 10 },
  { id: 10, name: "Lab Analyzer #1", type: "laboratory", status: "online", ip: "192.168.1.70", risk: 40 },
  { id: 11, name: "Ultrasound #1", type: "diagnostic", status: "online", ip: "192.168.1.80", risk: 22 },
  { id: 12, name: "ECG Monitor #1", type: "monitoring", status: "online", ip: "192.168.1.90", risk: 18 },
];

const deviceTypeColors: Record<string, string> = {
  imaging: "#3b82f6",
  monitoring: "#22c55e",
  therapeutic: "#a855f7",
  infusion: "#f97316",
  laboratory: "#06b6d4",
  diagnostic: "#ec4899",
  surgical: "#ef4444",
  other: "#64748b"
};

export default function DeviceDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<typeof demoDevices[0] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Network topology visualization using ECharts
  const topologyOptions = useMemo(() => {
    const nodes = [
      { id: 'router', name: 'Core Router', category: 0, symbolSize: 50, x: 400, y: 50 },
      ...demoDevices.map((d, i) => ({
        id: d.id.toString(),
        name: d.name,
        category: d.status === 'online' ? 1 : d.status === 'offline' ? 2 : 3,
        symbolSize: 35 + (d.risk / 10),
        value: d.risk,
        itemStyle: {
          color: deviceTypeColors[d.type] || deviceTypeColors.other,
          borderColor: d.status === 'online' ? '#22c55e' : d.status === 'offline' ? '#ef4444' : '#eab308',
          borderWidth: 3
        }
      }))
    ];

    const links = demoDevices.map(d => ({
      source: 'router',
      target: d.id.toString(),
      lineStyle: {
        color: d.status === 'online' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)',
        width: 2,
        curveness: 0.1
      }
    }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        textStyle: { color: '#e2e8f0' },
        formatter: (params: any) => {
          if (params.dataType === 'node' && params.data.id !== 'router') {
            const device = demoDevices.find(d => d.id.toString() === params.data.id);
            if (device) {
              return `<div class="p-2">
                <div class="font-bold">${device.name}</div>
                <div class="text-sm">IP: ${device.ip}</div>
                <div class="text-sm">Type: ${device.type}</div>
                <div class="text-sm">Risk Score: ${device.risk}</div>
              </div>`;
            }
          }
          return params.name;
        }
      },
      legend: {
        data: ['Router', 'Online', 'Offline', 'Maintenance'],
        textStyle: { color: '#94a3b8' },
        bottom: 10
      },
      series: [{
        type: 'graph',
        layout: 'force',
        animation: true,
        roam: true,
        draggable: true,
        categories: [
          { name: 'Router', itemStyle: { color: '#8b5cf6' } },
          { name: 'Online', itemStyle: { color: '#22c55e' } },
          { name: 'Offline', itemStyle: { color: '#ef4444' } },
          { name: 'Maintenance', itemStyle: { color: '#eab308' } }
        ],
        data: nodes,
        links: links,
        force: {
          repulsion: 200,
          edgeLength: [100, 200],
          gravity: 0.1
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 4 }
        },
        label: {
          show: true,
          position: 'bottom',
          color: '#94a3b8',
          fontSize: 10
        },
        lineStyle: {
          opacity: 0.6
        }
      }]
    };
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const filteredDevices = demoDevices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.ip.includes(searchQuery);
    const matchesType = filterType === "all" || device.type === filterType;
    const matchesStatus = filterStatus === "all" || device.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'offline': return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Server className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      online: "badge-success",
      offline: "badge-critical",
      maintenance: "badge-medium"
    };
    return <Badge className={variants[status] || "badge-low"}>{status}</Badge>;
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
            <Network className="h-7 w-7 text-primary" />
            Device Discovery
          </h1>
          <p className="text-muted-foreground mt-1">
            Network topology and medical device mapping
          </p>
        </div>
        <Button onClick={handleScan} disabled={isScanning} className="cyber-glow">
          <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan Network'}
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Devices", value: demoDevices.length, icon: Server },
          { label: "Online", value: demoDevices.filter(d => d.status === 'online').length, icon: Wifi },
          { label: "Offline", value: demoDevices.filter(d => d.status === 'offline').length, icon: WifiOff },
          { label: "High Risk", value: demoDevices.filter(d => d.risk > 40).length, icon: AlertTriangle }
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

      {/* Network Topology */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Network Topology
          </CardTitle>
          <CardDescription>Interactive visualization of connected medical devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] rounded-lg bg-secondary/30 cyber-grid">
            <ReactECharts 
              option={topologyOptions} 
              style={{ height: '100%', width: '100%' }}
              onEvents={{
                click: (params: any) => {
                  if (params.dataType === 'node' && params.data.id !== 'router') {
                    const device = demoDevices.find(d => d.id.toString() === params.data.id);
                    setSelectedDevice(device || null);
                  }
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Device List */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Device Inventory</CardTitle>
              <CardDescription>All discovered medical devices on the network</CardDescription>
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
                <SelectTrigger className="w-40 bg-secondary border-border/50">
                  <SelectValue placeholder="Device Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="imaging">Imaging</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="therapeutic">Therapeutic</SelectItem>
                  <SelectItem value="infusion">Infusion</SelectItem>
                  <SelectItem value="laboratory">Laboratory</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32 bg-secondary border-border/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
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
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">IP Address</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device, index) => (
                  <tr 
                    key={device.id} 
                    className="border-t border-border/30 hover:bg-secondary/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedDevice(device)}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: deviceTypeColors[device.type] }}
                        />
                        <span className="font-medium">{device.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground capitalize">{device.type}</td>
                    <td className="p-3 font-mono text-sm">{device.ip}</td>
                    <td className="p-3">{getStatusBadge(device.status)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${device.risk}%`,
                              backgroundColor: device.risk > 60 ? '#ef4444' : device.risk > 40 ? '#eab308' : '#22c55e'
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{device.risk}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Selected Device Detail Panel */}
      {selectedDevice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-card border-border/50 border-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  {selectedDevice.name}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDevice(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">IP Address</p>
                  <p className="font-mono">{selectedDevice.ip}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Device Type</p>
                  <p className="capitalize">{selectedDevice.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedDevice.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className={`font-bold ${selectedDevice.risk > 60 ? 'text-red-500' : selectedDevice.risk > 40 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {selectedDevice.risk}/100
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
