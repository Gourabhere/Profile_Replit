import React from "react";
import { MobileHeader } from "@/components/ui/mobile-header";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, HelpCircle, LogOut, FileSpreadsheet } from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { toast } = useToast();
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader title="Profile" />
      
      <main className="flex-1 p-4 pb-20">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-primary rounded-full p-4 mr-4">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">TCS Admin</h2>
                <p className="text-gray-500">admin@tcs.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <h3 className="font-medium">Data Management</h3>
          </CardHeader>
          <CardContent className="p-0">
            <Link href="/upload">
              <Button variant="ghost" className="w-full justify-start p-4 rounded-none">
                <FileSpreadsheet className="h-5 w-5 mr-3" />
                Import Candidate Data
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <h3 className="font-medium">Settings</h3>
          </CardHeader>
          <CardContent className="p-0">
            <Button variant="ghost" className="w-full justify-start p-4 rounded-none border-b">
              <Settings className="h-5 w-5 mr-3" />
              Application Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start p-4 rounded-none">
              <HelpCircle className="h-5 w-5 mr-3" />
              Help & Support
            </Button>
          </CardContent>
        </Card>
        
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
