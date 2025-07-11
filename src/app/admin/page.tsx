import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "@/app/admin/data.json";

const AdminPage = () => (
  <>
    <SectionCards />
    <div className="px-4 lg:px-6">
      <ChartAreaInteractive />
    </div>
    <DataTable data={data} />
  </>
);

export default AdminPage;
