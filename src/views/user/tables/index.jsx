import { columnsDataComplex } from "./variables/columnsData";
import tableDataComplex from "./variables/tableDataComplex.json";
import ComplexTable from "./components/ComplexTable";
import TimesheetList from "./components/TimesheetList";

const Tables = () => {
  return (
    <div>
      <div className="mt-5 grid h-full gap-5">
        <TimesheetList />
      </div>
    </div>
  );
};

export default Tables;
