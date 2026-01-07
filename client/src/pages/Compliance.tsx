import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Download,
  ExternalLink,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Compliance() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Security & Compliance</h1>
          <p className="text-muted-foreground mt-1">Manage regulatory compliance, security audits, and policy enforcement.</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <FileText className="w-4 h-4" />
          Generate Audit Report
        </Button>
      </div>

      {/* Compliance Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
            <CardDescription>Overall adherence to security standards and regulations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-muted/20"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - 0.98)}
                      className="text-green-500"
                    />
                  </svg>
                  <span className="absolute text-2xl font-bold">98%</span>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold">Excellent Compliance Score</h3>
                  <p className="text-sm text-muted-foreground">
                    Your network segmentation implementation meets or exceeds all critical security requirements. 
                    Next scheduled audit is in 14 days.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>HIPAA</span>
                    <span className="text-green-500">100%</span>
                  </div>
                  <Progress value={100} className="h-2" style={{ "--progress-background": "var(--chart-2)" } as React.CSSProperties} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>NIST CSF</span>
                    <span className="text-green-500">96%</span>
                  </div>
                  <Progress value={96} className="h-2" style={{ "--progress-background": "var(--chart-2)" } as React.CSSProperties} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>GDPR</span>
                    <span className="text-green-500">98%</span>
                  </div>
                  <Progress value={98} className="h-2" style={{ "--progress-background": "var(--chart-2)" } as React.CSSProperties} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>Tasks requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-500">Review Access Logs</h4>
                  <p className="text-xs text-muted-foreground mt-1">Weekly review of admin access logs is due.</p>
                  <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-yellow-500">Review Now</Button>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Calendar className="w-5 h-5 text-blue-500 shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-500">Schedule Penetration Test</h4>
                  <p className="text-xs text-muted-foreground mt-1">Quarterly external security assessment.</p>
                  <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-blue-500">Schedule</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Checklist */}
      <Tabs defaultValue="controls" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="controls">Security Controls</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="audits">Audit Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="controls" className="mt-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Security Controls Checklist</CardTitle>
              <CardDescription>Verification of implemented security measures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Network Segmentation", status: "Implemented", desc: "Critical devices isolated in separate VLANs" },
                  { title: "Access Control (NAC)", status: "Implemented", desc: "802.1X authentication enforced on all ports" },
                  { title: "Traffic Encryption", status: "Implemented", desc: "TLS 1.3 required for all internal traffic" },
                  { title: "Intrusion Detection", status: "Active", desc: "Real-time monitoring with automated blocking" },
                  { title: "Vulnerability Scanning", status: "Scheduled", desc: "Daily automated scans of all assets" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="policies">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Policy Documents</CardTitle>
              <CardDescription>Active security policies and procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {[
                  "Network Security Policy v2.4",
                  "Incident Response Plan v1.2",
                  "Data Classification Standard",
                  "Remote Access Policy",
                  "Device Hardening Guidelines"
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-medium">{doc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Updated 2 days ago</span>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
