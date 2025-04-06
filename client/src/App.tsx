import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Search from "@/pages/search";
import AdvancedSearch from "@/pages/advanced-search";
import Upload from "@/pages/upload";
import Saved from "@/pages/saved";
import Profile from "@/pages/profile";
import CandidateDetail from "@/pages/candidate-detail";

function Router() {
  return (
    <Switch>
      {/* Main navigation pages */}
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/saved" component={Saved} />
      <Route path="/profile" component={Profile} />
      
      {/* Other pages */}
      <Route path="/advanced-search" component={AdvancedSearch} />
      <Route path="/upload" component={Upload} />
      <Route path="/candidate/:id" component={CandidateDetail} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
