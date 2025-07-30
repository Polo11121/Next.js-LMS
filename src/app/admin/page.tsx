import { Suspense } from "react";
import { DashboardChart } from "@/app/admin/_components/dashboard-chart";
import { DashboardAdminStatsLoader } from "@/app/admin/_components/dashboard-admin-stats-loader";
import { DashboardAdminStats } from "@/app/admin/_components/dashboard-admin-stats";
import { getAdminChartsData } from "@/data/admin/get-admin-charts-data";
import { DashboardRecentCourses } from "@/app/admin/_components/dashboard-recent-courses";

const AdminPage = async () => {
  const chartsData = await getAdminChartsData();

  return (
    <>
      <Suspense fallback={<DashboardAdminStatsLoader />}>
        <DashboardAdminStats />
      </Suspense>
      <DashboardChart data={chartsData} />
      <DashboardRecentCourses />
    </>
  );
};

export default AdminPage;
