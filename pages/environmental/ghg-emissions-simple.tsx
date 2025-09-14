import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GHGEmissions() {
  console.log("GHG Emissions component rendered successfully!");
  
  // Mock data for display
  const emissionsData = {
    scope1: 12450,
    scope2: 28730,
    scope3: 156890,
    total: 198070
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GHG Emissions Tracker</h1>
          <p className="text-gray-600 mt-1">
            Scope 1-3 emissions tracking following GHG Protocol Corporate Accounting Standards
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emissionsData.total.toLocaleString()} tCO₂e</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scope 1 Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emissionsData.scope1.toLocaleString()} tCO₂e</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scope 2 Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emissionsData.scope2.toLocaleString()} tCO₂e</div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center p-8 bg-green-50 rounded-lg border-2 border-green-200">
        <p className="text-green-700 font-semibold">✅ GHG Emissions page loaded successfully!</p>
        <p className="text-sm text-green-600 mt-2">Route: /environmental/ghg-emissions</p>
        <p className="text-sm text-gray-500 mt-1">Component loaded and routing works!</p>
      </div>
    </div>
  );
}