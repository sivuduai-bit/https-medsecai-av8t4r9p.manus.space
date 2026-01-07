import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { FileText, Download, Plus, Search, Calendar, Clock, FileCheck, Shield, Bug, Activity, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

// Report templates
const REPORT_TEMPLATES = [
  { id: "tga_compliance", name: "TGA Compliance Report", description: "Full compliance assessment against TGA Essential Principles", icon: FileCheck, category: "compliance" },
  { id: "vulnerability_summary", name: "Vulnerability Summary", description: "Overview of all detected vulnerabilities with CVSS scores", icon: Bug, category: "security" },
  { id: "risk_assessment", name: "Risk Assessment Report", description: "Comprehensive risk analysis with recommendations", icon: Shield, category: "security" },
  { id: "penetration_test", name: "Penetration Test Report", description: "Results from AI agent security testing", icon: Activity, category: "security" },
  { id: "iso_14971", name: "ISO 14971 Risk Management", description: "Risk management documentation for medical devices", icon: FileText, category: "standards" },
  { id: "iec_62304", name: "IEC 62304 Software Lifecycle", description: "Software development lifecycle documentation", icon: FileText, category: "standards" },
  { id: "nist_csf", name: "NIST CSF Assessment", description: "Cybersecurity framework compliance assessment", icon: Shield, category: "standards" },
  { id: "executive_summary", name: "Executive Summary", description: "High-level security posture overview for leadership", icon: FileText, category: "summary" }
];

// Demo generated reports
const GENERATED_REPORTS = [
  { id: 1, name: "TGA Compliance Report - Q4 2024", template: "tga_compliance", generatedAt: "2024-12-15", size: "2.4 MB", status: "ready" },
  { id: 2, name: "Vulnerability Summary - December", template: "vulnerability_summary", generatedAt: "2024-12-14", size: "1.8 MB", status: "ready" },
  { id: 3, name: "Risk Assessment - All Devices", template: "risk_assessment", generatedAt: "2024-12-13", size: "3.1 MB", status: "ready" },
  { id: 4, name: "Penetration Test Results", template: "penetration_test", generatedAt: "2024-12-12", size: "4.2 MB", status: "ready" },
  { id: 5, name: "ISO 14971 Documentation", template: "iso_14971", generatedAt: "2024-12-10", size: "1.5 MB", status: "ready" },
  { id: 6, name: "Executive Summary - Board Meeting", template: "executive_summary", generatedAt: "2024-12-08", size: "0.8 MB", status: "ready" }
];

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedDevices, setSelectedDevices] = useState<string[]>(["all"]);
  const [dateRange, setDateRange] = useState("30d");

  const handleGenerateReport = () => {
    if (!selectedTemplate) {
      toast.error("Please select a report template");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Report generated successfully");
    }, 3000);
  };

  const filteredTemplates = REPORT_TEMPLATES.filter(t => 
    filterCategory === "all" || t.category === filterCategory
  );

  const filteredReports = GENERATED_REPORTS.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      compliance: "bg-green-500/20 text-green-400 border-green-500/30",
      security: "bg-red-500/20 text-red-400 border-red-500/30",
      standards: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      summary: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    };
    return <Badge className={`${colors[category] || colors.summary} border`}>{category}</Badge>;
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
            <FileText className="h-7 w-7 text-primary" />
            Compliance Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            TGA-specific templates and automated compliance reporting
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="cyber-glow">
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
              <DialogDescription>Select a template and configure report parameters</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {/* Template Selection */}
              <div>
                <p className="text-sm font-medium mb-3">Select Template</p>
                <div className="grid grid-cols-2 gap-3">
                  {REPORT_TEMPLATES.slice(0, 4).map((template) => {
                    const Icon = template.icon;
                    const isSelected = selectedTemplate === template.id;
                    return (
                      <div
                        key={template.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border/50 hover:border-border bg-secondary/30'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <p className="font-medium text-sm">{template.name}</p>
                            <p className="text-xs text-muted-foreground">{template.category}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Device Selection */}
              <div>
                <p className="text-sm font-medium mb-3">Include Devices</p>
                <div className="space-y-2">
                  {[
                    { id: "all", label: "All Devices" },
                    { id: "critical", label: "Critical Devices Only" },
                    { id: "non_compliant", label: "Non-Compliant Devices" }
                  ].map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Checkbox 
                        id={option.id}
                        checked={selectedDevices.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDevices([option.id]);
                          }
                        }}
                      />
                      <label htmlFor={option.id} className="text-sm">{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <p className="text-sm font-medium mb-3">Date Range</p>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="bg-secondary border-border/50">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button 
                className="w-full cyber-glow" 
                onClick={handleGenerateReport}
                disabled={isGenerating || !selectedTemplate}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Report Templates */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Report Templates</CardTitle>
              <CardDescription>Pre-configured templates for compliance and security reports</CardDescription>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40 bg-secondary border-border/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="standards">Standards</SelectItem>
                <SelectItem value="summary">Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="bg-secondary/30 border-border/30 hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {getCategoryBadge(template.category)}
                    </div>
                    <h3 className="font-medium mt-3">{template.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Generated Reports */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Generated Reports</CardTitle>
              <CardDescription>Previously generated compliance and security reports</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search reports..." 
                className="pl-9 w-64 bg-secondary border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredReports.map((report) => {
              const template = REPORT_TEMPLATES.find(t => t.id === report.template);
              const Icon = template?.icon || FileText;
              return (
                <div 
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{report.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {report.generatedAt}
                        </span>
                        <span>{report.size}</span>
                        {template && getCategoryBadge(template.category)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="badge-success border">Ready</Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Standards Mapping */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Standards Mapping</CardTitle>
          <CardDescription>Supported regulatory standards and frameworks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "TGA Essential Principles", description: "Australian medical device regulations", coverage: "100%" },
              { name: "ISO 14971", description: "Risk management for medical devices", coverage: "95%" },
              { name: "IEC 62304", description: "Medical device software lifecycle", coverage: "90%" },
              { name: "NIST CSF", description: "Cybersecurity Framework", coverage: "85%" }
            ].map((standard, i) => (
              <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                <h3 className="font-medium">{standard.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{standard.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Coverage</span>
                  <span className="text-sm font-bold text-primary">{standard.coverage}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
