import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import DashboardLayout from "./components/DashboardLayout";

// Pages
import Home from "./pages/Home";
import DeviceDiscovery from "./pages/DeviceDiscovery";
import Vulnerabilities from "./pages/Vulnerabilities";
import TgaCompliance from "./pages/TgaCompliance";
import AiAgents from "./pages/AiAgents";
import RiskAssessment from "./pages/RiskAssessment";
import Reports from "./pages/Reports";
import Inventory from "./pages/Inventory";
import Alerts from "./pages/Alerts";
import Admin from "./pages/Admin";
import Segments from "./pages/Segments";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/devices" component={DeviceDiscovery} />
        <Route path="/vulnerabilities" component={Vulnerabilities} />
        <Route path="/compliance" component={TgaCompliance} />
        <Route path="/segments" component={Segments} />
        <Route path="/ai-agents" component={AiAgents} />
        <Route path="/risk" component={RiskAssessment} />
        <Route path="/reports" component={Reports} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/admin" component={Admin} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
