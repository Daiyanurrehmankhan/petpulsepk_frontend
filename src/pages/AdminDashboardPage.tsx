import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axiosClient from "@/lib/api/axios-client";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  PawPrint,
  ShoppingCart,
  Calendar,
  TrendingUp,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const response = await axiosClient.get("/admin/dashboard/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-slate-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // Transform data for charts
  const petsByTypeData = stats?.charts?.petsByType || [];
  const appointmentsByStatusData = stats?.charts?.appointmentsByStatus || [];
  const userGrowthData = stats?.charts?.userGrowth || [];
  const marketplaceData = stats?.charts?.marketplace || [];

  // Summary cards data
  const summaryCards = [
    {
      title: "Total Users",
      value: stats?.summary?.totalUsers?.total || 0,
      subtitle: `${stats?.summary?.totalUsers?.owners || 0} owners, ${stats?.summary?.totalUsers?.vets || 0} vets`,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Total Pets",
      value: stats?.summary?.totalPets?.total || 0,
      subtitle: `${stats?.summary?.totalPets?.male || 0} males, ${stats?.summary?.totalPets?.female || 0} females`,
      icon: PawPrint,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Active Listings",
      value: stats?.summary?.totalListings?.active || 0,
      subtitle: `${stats?.summary?.totalListings?.sold || 0} sold, PKR ${(stats?.summary?.totalListings?.totalSalesValue || 0).toLocaleString()}`,
      icon: ShoppingCart,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950",
    },
    {
      title: "Appointments",
      value: stats?.summary?.totalAppointments?.total || 0,
      subtitle: `${stats?.summary?.totalAppointments?.completed || 0} completed`,
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Real-time platform analytics and statistics
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={fetchStats}
                disabled={refreshing}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button onClick={handleLogout} variant="destructive" className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6">
                  <div className={`${card.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                      {card.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                      {card.subtitle}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Users Growth Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                User Growth (Last 30 Days)
              </CardTitle>
              <CardDescription>
                Daily new user registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Appointments by Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                Appointments by Status
              </CardTitle>
              <CardDescription>
                Distribution of appointment statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={appointmentsByStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {appointmentsByStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pets by Breed */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PawPrint className="h-5 w-5 text-green-500" />
                Top Pets by Breed
              </CardTitle>
              <CardDescription>
                Most registered pet breeds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={petsByTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    style={{ fontSize: "12px" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Marketplace Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-amber-500" />
                Marketplace Statistics
              </CardTitle>
              <CardDescription>
                Listings by status and average prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={marketplaceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="status"
                    stroke="#64748b"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#64748b" }} />
                  <Bar dataKey="count" fill="#f59e0b" name="Count" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <CardHeader>
              <CardTitle className="text-lg">Total Revenue</CardTitle>
              <CardDescription>
                From completed sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                PKR {(stats?.summary?.totalListings?.totalSalesValue || 0).toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                {stats?.summary?.totalListings?.sold || 0} completed transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
            <CardHeader>
              <CardTitle className="text-lg">Active Users</CardTitle>
              <CardDescription>
                Pet owners and vets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {(stats?.summary?.totalUsers?.total || 0).toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                {stats?.summary?.totalUsers?.owners || 0} owners actively using platform
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <CardHeader>
              <CardTitle className="text-lg">Appointment Completion</CardTitle>
              <CardDescription>
                Vet appointment metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats?.summary?.totalAppointments?.completed || 0}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                {stats?.summary?.totalAppointments?.pending || 0} pending appointments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Last updated: {new Date(stats?.timestamp).toLocaleString()}</p>
          <p className="mt-2">Welcome to PetPulse Admin Dashboard • All data is real-time</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
