import { useState } from "react";
import { 
  Plus, 
  MoreVertical, 
  Shield, 
  Users, 
  Activity, 
  Lock, 
  Unlock,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Mock Data
const initialSegments = [
  {
    id: 1,
    name: "Administrative Network",
    type: "Administrative",
    ipRange: "192.168.1.70 - 192.168.1.90",
    securityLevel: "Low",
    devices: 2,
    isolation: false,
    status: "Active",
    color: "bg-blue-500"
  },
  {
    id: 2,
    name: "Critical Care Network",
    type: "Critical Care",
    ipRange: "192.168.1.20 - 192.168.1.60",
    securityLevel: "High",
    devices: 5,
    isolation: true,
    status: "Active",
    color: "bg-red-500"
  },
  {
    id: 3,
    name: "Imaging Network",
    type: "Imaging",
    ipRange: "192.168.1.10 - 192.168.1.50",
    securityLevel: "Medium",
    devices: 4,
    isolation: false,
    status: "Active",
    color: "bg-orange-500"
  }
];

export default function Segments() {
  const [segments, setSegments] = useState(initialSegments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form State
  const [newSegmentName, setNewSegmentName] = useState("");
  const [newSegmentType, setNewSegmentType] = useState("");
  const [ipStart, setIpStart] = useState("");
  const [ipEnd, setIpEnd] = useState("");

  const handleAddSegment = () => {
    if (!newSegmentName || !newSegmentType || !ipStart || !ipEnd) {
      toast.error("Please fill in all fields");
      return;
    }

    const newSegment = {
      id: segments.length + 1,
      name: newSegmentName,
      type: newSegmentType,
      ipRange: `${ipStart} - ${ipEnd}`,
      securityLevel: newSegmentType === "Critical Care" ? "High" : newSegmentType === "Administrative" ? "Low" : "Medium",
      devices: 0,
      isolation: newSegmentType === "Critical Care",
      status: "Active",
      color: newSegmentType === "Critical Care" ? "bg-red-500" : newSegmentType === "Administrative" ? "bg-blue-500" : "bg-orange-500"
    };

    setSegments([...segments, newSegment]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewSegmentName("");
    setNewSegmentType("");
    setIpStart("");
    setIpEnd("");
    
    toast.success("Network segment created successfully");
  };

  const handleDeleteSegment = (id: number) => {
    setSegments(segments.filter(s => s.id !== id));
    toast.success("Segment deleted successfully");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Network Segments</h1>
          <p className="text-muted-foreground mt-1">Manage network zones, isolation policies, and security levels.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Add Segment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Segment</DialogTitle>
              <DialogDescription>
                Define a new network zone for device isolation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Segment Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Laboratory Network" 
                  value={newSegmentName}
                  onChange={(e) => setNewSegmentName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Segment Type</Label>
                <Select value={newSegmentType} onValueChange={setNewSegmentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Critical Care">Critical Care</SelectItem>
                    <SelectItem value="Imaging">Imaging</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ip">IP Range</Label>
                <div className="flex gap-2 items-center">
                  <Input 
                    id="ip-start" 
                    placeholder="192.168.1.100" 
                    value={ipStart}
                    onChange={(e) => setIpStart(e.target.value)}
                  />
                  <span>-</span>
                  <Input 
                    id="ip-end" 
                    placeholder="192.168.1.150" 
                    value={ipEnd}
                    onChange={(e) => setIpEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSegment}>Create Segment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-card/50 p-4 rounded-lg border border-border/50 backdrop-blur-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search segments..." className="pl-9 bg-background" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map((segment) => (
          <Card key={segment.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${segment.color} bg-opacity-20 text-white`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{segment.name}</CardTitle>
                    <CardDescription className="mt-1">{segment.type}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Configuration</DropdownMenuItem>
                    <DropdownMenuItem>Manage Devices</DropdownMenuItem>
                    <DropdownMenuItem>View Logs</DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive" 
                      onClick={() => handleDeleteSegment(segment.id)}
                    >
                      Delete Segment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pb-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Security Level</span>
                  <Badge variant={segment.securityLevel === 'High' ? 'destructive' : segment.securityLevel === 'Medium' ? 'default' : 'secondary'} className="mt-1">
                    {segment.securityLevel}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Isolation</span>
                  <div className="flex items-center gap-2 mt-1">
                    {segment.isolation ? (
                      <Lock className="w-4 h-4 text-green-500" />
                    ) : (
                      <Unlock className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">{segment.isolation ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">IP Range</span>
                <p className="text-sm font-mono bg-muted/50 p-2 rounded border border-border/50">{segment.ipRange}</p>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex items-center justify-between border-t border-border/50 p-4 bg-muted/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4" />
                <span>{segment.status}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4" />
                <span>{segment.devices} Devices</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
