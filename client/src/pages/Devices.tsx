import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Server, 
  Wifi, 
  WifiOff,
  ShieldAlert,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock Data
const devices = [
  { id: "DEV-001", name: "Patient Monitor #1", type: "Monitoring", ip: "192.168.1.21", segment: "Critical Care", status: "Online", lastSeen: "Just now" },
  { id: "DEV-002", name: "Patient Monitor #2", type: "Monitoring", ip: "192.168.1.22", segment: "Critical Care", status: "Online", lastSeen: "2 mins ago" },
  { id: "DEV-003", name: "Ventilator #1", type: "Therapeutic", ip: "192.168.1.23", segment: "Critical Care", status: "Online", lastSeen: "Just now" },
  { id: "DEV-004", name: "MRI Scanner #1", type: "Imaging", ip: "192.168.1.11", segment: "Imaging", status: "Idle", lastSeen: "15 mins ago" },
  { id: "DEV-005", name: "CT Scanner #1", type: "Imaging", ip: "192.168.1.12", segment: "Imaging", status: "Maintenance", lastSeen: "1 hour ago" },
  { id: "DEV-006", name: "Lab Analyzer #1", type: "Laboratory", ip: "192.168.1.71", segment: "Admin", status: "Online", lastSeen: "5 mins ago" },
  { id: "DEV-007", name: "Defibrillator #1", type: "Therapeutic", ip: "192.168.1.24", segment: "Critical Care", status: "Offline", lastSeen: "2 days ago" },
  { id: "DEV-008", name: "X-Ray Machine #1", type: "Imaging", ip: "192.168.1.13", segment: "Imaging", status: "Online", lastSeen: "10 mins ago" },
];

export default function Devices() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Device Inventory</h1>
          <p className="text-muted-foreground mt-1">Monitor connected medical devices and their network status.</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Server className="w-4 h-4" />
          Add Device
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">+2 from last week</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Online Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">92%</div>
            <p className="text-xs text-muted-foreground mt-1">11/12 Devices Online</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">0</div>
            <p className="text-xs text-muted-foreground mt-1">No active threats</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, IP, or type..." className="pl-9 bg-background" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead>Device Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Network Segment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id} className="hover:bg-muted/50 border-border/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-muted-foreground" />
                      {device.name}
                    </div>
                  </TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell className="font-mono text-xs">{device.ip}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {device.segment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {device.status === 'Online' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      {device.status === 'Offline' && <WifiOff className="w-4 h-4 text-destructive" />}
                      {device.status === 'Maintenance' && <ShieldAlert className="w-4 h-4 text-orange-500" />}
                      {device.status === 'Idle' && <Wifi className="w-4 h-4 text-blue-500" />}
                      <span>{device.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{device.lastSeen}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Network Settings</DropdownMenuItem>
                        <DropdownMenuItem>Security Scan</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Disconnect</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
