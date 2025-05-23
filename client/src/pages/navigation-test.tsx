import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const NavigationTest = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Navigation Test Page</CardTitle>
          <CardDescription>
            Use this page to test navigation and routing in the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Main Navigation</h2>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/">Dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/cost-analysis">Cost Analysis</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/route-analysis">Route Analysis</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/tariff-analysis">Tariff Analysis</Link>
              </Button>
            </div>

            <h2 className="text-lg font-semibold mt-4">Regulations Pages</h2>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/regulations-menu">Regulations Menu</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/regulations">Basic Regulations</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/regulations-detailed">Detailed Regulations</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/regulations-exemptions">Exemptions</Link>
              </Button>
            </div>

            <h2 className="text-lg font-semibold mt-4">Special Programs</h2>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/special-programs">Special Programs</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/duty-drawback">Duty Drawback</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/trade-zones">Trade Zones</Link>
              </Button>
            </div>

            <h2 className="text-lg font-semibold mt-4">AI Features</h2>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/ai-guidance">AI Guidance</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/ai-predictions">AI Predictions</Link>
              </Button>
            </div>

            <h2 className="text-lg font-semibold mt-4">Account</h2>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/auth/register">Register</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/profile">Profile</Link>
              </Button>
            </div>

            <div className="mt-8 p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">Navigation Diagnostics</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Current Path:</strong> {window.location.pathname}</p>
                <p><strong>URL Hash:</strong> {window.location.hash || '(none)'}</p>
                <p><strong>Full URL:</strong> {window.location.href}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationTest;

