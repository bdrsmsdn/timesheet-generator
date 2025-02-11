import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { toast } from "react-toastify";
import { Tab } from "@headlessui/react";
import Card from "components/card";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CustomSelect from "./CustomSelect";
import { PulseLoader } from "react-spinners";
import { Swal } from "sweetalert2/dist/sweetalert2";

const EditTimesheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state and validation
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      divisi: "",
      department: "",
      team: "",
      vendor: "",
      monthYear: null,
      month: null,
      year: null,
      activities: [],
    },
  });

  const [activeTab, setActiveTab] = useState(0);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [vendors, setVendors] = useState([]);

  // Dropdown options
  const typeOptions = [
    { value: "H", label: "Hadir" },
    { value: "C", label: "Cuti" },
    { value: "S", label: "Sakit" },
    { value: "I", label: "Izin" },
    { value: "L", label: "Libur / Cuti Bersama" },
  ];

  const typeMapping = {
    LS: "Sabtu",
    LM: "Minggu",
  };

  // Fetch timesheet data for editing
  useEffect(() => {
    const fetchTimesheetData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${process.env.REACT_APP_URL_API}/api/timesheet/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        // Populate form with existing data
        reset({
          divisi: data.divisi._id,
          department: data.department._id,
          team: data.team._id,
          vendor: data.vendor._id,
          monthYear: new Date(data.year, data.month - 1), // Convert to Date object
          month: data.month,
          year: data.year,
          activities: data.activities.map((activity) => ({
            type: activity.type,
            date: activity.date,
            clockIn: activity.clockIn,
            clockOut: activity.clockOut,
            project: activity.project,
            projectCode: activity.projectCode,
            activities: activity.activities,
          })),
        });

        // Dropdown
        setValue("divisi", data.divisi._id);
        setValue("department", data.department._id);
        setValue("team", data.team._id);
        setValue("vendor", data.vendor._id);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching timesheet:", error);
        setIsLoading(false);
      }
    };

    // Fetch initial dropdown data
    const fetchInitialData = async () => {
      try {
        // Replace with actual API calls
        const [divisionsRes, departmentsRes, teamsRes, vendorsRes] =
          await Promise.all([
            fetch(process.env.REACT_APP_URL_API + "/api/divisi"),
            fetch(process.env.REACT_APP_URL_API + "/api/department"),
            fetch(process.env.REACT_APP_URL_API + "/api/team"),
            fetch(process.env.REACT_APP_URL_API + "/api/vendor"),
          ]);

        setDivisions(await divisionsRes.json());
        setDepartments(await departmentsRes.json());
        setTeams(await teamsRes.json());
        setVendors(await vendorsRes.json());
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchTimesheetData();
    fetchInitialData();
  }, [id, reset, setValue]);

  useEffect(() => {}, [activities]);

  // Function to add a new activity
  const addActivity = () => {
    const currentActivities = watch("activities");
    setValue("activities", [
      ...currentActivities,
      {
        type: "",
        date: null,
        clockIn: "",
        clockOut: "",
        project: "",
        projectCode: "",
        activities: "",
      },
    ]);
  };

  // Submit handler
  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await fetch(`${process.env.REACT_APP_URL_API}/api/timesheet/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Redirect or show success message
      toast.success("Timesheet editted successfully");
      navigate("/user/data-tables");
    } catch (error) {
      console.error("Error updating timesheet:", error);
      setIsSubmitting(false);
    }
  };

  const handleDeleteActivity = (index) => {
    const activity = activities[index];

    if (activity && Object.values(activity).some((value) => value)) {
      Swal.fire({
        title: "Yakin ingin menghapus?",
        text: "Data yang sudah diisi akan hilang.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          removeActivity(index);
        }
      });
    } else {
      removeActivity(index);
    }
  };

  const removeActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);

    setValue("activities", updatedActivities, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setActivities(updatedActivities); // Tambahkan ini

    console.log("After delete:", updatedActivities);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="mb-8 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/user/data-tables")}
            className="text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">
            Edit Timesheet
          </h2>
        </div>
      </div>
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex space-x-2 border-b dark:border-gray-700">
          <Tab
            className={({ selected }) =>
              selected
                ? "border-b-2 border-blue-500 px-4 py-2 text-blue-500 dark:border-blue-400 dark:text-blue-400"
                : "px-4 py-2 text-gray-600 dark:text-gray-400"
            }
          >
            Timesheet Details
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? "border-b-2 border-blue-500 px-4 py-2 text-blue-500 dark:border-blue-400 dark:text-blue-400"
                : "px-4 py-2 text-gray-600 dark:text-gray-400"
            }
          >
            Activity
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Divisi Dropdown */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Divisi
                </label>
                <CustomSelect
                  name="divisi"
                  options={divisions.map((d) => ({
                    value: d._id,
                    label: d.name,
                  }))}
                  isLoading={isLoading}
                  control={control}
                  defaultValue=""
                />
                {errors.divisi && (
                  <p className="text-sm text-red-500">
                    {errors.divisi.message}
                  </p>
                )}
              </div>

              {/* Department Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Department
                </label>
                <CustomSelect
                  name="department"
                  options={departments.map((d) => ({
                    value: d._id,
                    label: d.name,
                  }))}
                  isLoading={isLoading}
                  control={control}
                  defaultValue=""
                />
                {errors.department && (
                  <p className="text-sm text-red-500">
                    {errors.department.message}
                  </p>
                )}
              </div>

              {/* Team Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Team
                </label>
                <CustomSelect
                  name="team"
                  options={teams.map((t) => ({ value: t._id, label: t.name }))}
                  isLoading={isLoading}
                  control={control}
                  defaultValue=""
                />
                {errors.team && (
                  <p className="text-sm text-red-500">{errors.team.message}</p>
                )}
              </div>

              {/* Vendor Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Vendor
                </label>
                <CustomSelect
                  name="vendor"
                  options={vendors.map((v) => ({
                    value: v._id,
                    label: v.name,
                  }))}
                  isLoading={isLoading}
                  control={control}
                  defaultValue=""
                />
                {errors.vendor && (
                  <p className="text-sm text-red-500">
                    {errors.vendor.message}
                  </p>
                )}
              </div>

              {/* Month and Year Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Month and Year
                </label>
                <Controller
                  name="monthYear"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => {
                        setValue("month", date.getMonth() + 1);
                        setValue("year", date.getFullYear());
                        field.onChange(date);
                      }}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      placeholderText="Select Month and Year"
                      className="w-full rounded border p-2 dark:border-gray-700 dark:bg-navy-800 dark:text-white dark:placeholder-gray-400"
                    />
                  )}
                />
              </div>

              {/* Next Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab(1)}
                  className="flex w-[100px] items-center justify-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          </Tab.Panel>

          <Tab.Panel>
            <div className="space-y-4">
              {watch("activities").map((activity, index) => {
                const isDisabled = watch(`activities[${index}].type`) !== "H";
                const isDisabledLibur = !["H", "L"].includes(
                  watch(`activities[${index}].type`)
                );

                const selectedType = watch(`activities[${index}].type`);
                const isDisabledLSLM = ["LS", "LM"].includes(selectedType);

                return (
                  <div
                    key={index}
                    className="rounded border p-4 dark:border-gray-700"
                  >
                    <button
                      type="button"
                      onClick={() => handleDeleteActivity(index)}
                      className="top-25 absolute right-10 text-red-500 hover:text-gray-500"
                    >
                      <Trash2 size={20} />
                    </button>
                    {/* Type Dropdown */}
                    <div className="mb-4 mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <Controller
                        name={`activities[${index}].type`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={typeOptions}
                            placeholder="Select Type"
                            value={
                              typeMapping[selectedType]
                                ? {
                                    label: typeMapping[selectedType],
                                    value: selectedType,
                                  }
                                : typeOptions.find(
                                    (option) => option.value === field.value
                                  )
                            }
                            isDisabled={isDisabledLSLM}
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption?.value)
                            }
                          />
                        )}
                      />
                    </div>
                    {/* Date, Check In, Check Out section */}
                    <div className="mb-4">
                      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                        {/* Date */}
                        <div className="w-full sm:w-1/3">
                          <label className="block text-sm font-medium text-gray-700">
                            Date
                          </label>
                          <Controller
                            name={`activities[${index}].date`}
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                selected={
                                  field.value ? new Date(field.value) : null
                                }
                                onChange={(date) => {
                                  const formattedDate = date
                                    ? new Date(
                                        date.getTime() -
                                          date.getTimezoneOffset() * 60000
                                      ).toISOString()
                                    : null;
                                  field.onChange(formattedDate);
                                }}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select Date"
                                className={`dark:bg-navy-800, w-full rounded border p-2 dark:border-gray-700 ${
                                  isDisabledLSLM
                                    ? "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-500"
                                    : ""
                                }`}
                                disabled={isDisabledLSLM}
                              />
                            )}
                          />
                        </div>

                        {/* Check In */}
                        <div className="w-full sm:w-1/3">
                          <label className="block text-sm font-medium text-gray-700">
                            Check In
                          </label>
                          <Controller
                            name={`activities[${index}].clockIn`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="time"
                                className={`w-full rounded border p-2 dark:border-gray-700 dark:bg-navy-800 ${
                                  isDisabled
                                    ? "cursor-not-allowed bg-gray-200 dark:bg-gray-700"
                                    : ""
                                }`}
                                disabled={isDisabled}
                              />
                            )}
                          />
                        </div>

                        {/* Check Out */}
                        <div className="w-full sm:w-1/3">
                          <label className="block text-sm font-medium text-gray-700">
                            Check Out
                          </label>
                          <Controller
                            name={`activities[${index}].clockOut`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="time"
                                className={`w-full rounded border p-2 dark:border-gray-700 dark:bg-navy-800 ${
                                  isDisabled
                                    ? "cursor-not-allowed bg-gray-200 dark:bg-gray-700"
                                    : ""
                                }`}
                                disabled={isDisabled}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Project Section */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-white">
                        Project
                      </label>
                      <div className="space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
                        {/* Project Name */}
                        <div className="w-full sm:w-1/2">
                          <Controller
                            name={`activities[${index}].project`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`w-full rounded border p-2 dark:border-gray-700 dark:bg-navy-800 dark:text-white dark:placeholder-gray-400 ${
                                  isDisabled
                                    ? "cursor-not-allowed bg-gray-100 dark:bg-navy-800 dark:text-gray-400"
                                    : ""
                                }`}
                                placeholder="Enter Project Name"
                                disabled={isDisabled}
                              />
                            )}
                          />
                        </div>

                        {/* Project Code */}
                        <div className="w-full sm:w-1/2">
                          <Controller
                            name={`activities[${index}].projectCode`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`w-full rounded border p-2 dark:border-gray-700 dark:bg-navy-800 dark:text-white dark:placeholder-gray-400 ${
                                  isDisabled
                                    ? "cursor-not-allowed bg-gray-100 dark:bg-navy-800 dark:text-gray-400"
                                    : ""
                                }`}
                                placeholder="Enter Project Code"
                                disabled={isDisabled}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Activities */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white">
                        Activities
                      </label>
                      <Controller
                        name={`activities[${index}].activities`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`w-full rounded border p-2 dark:border-gray-700 dark:bg-navy-800 dark:text-white dark:placeholder-gray-400 ${
                              isDisabledLibur
                                ? "cursor-not-allowed bg-gray-100 dark:bg-navy-800 dark:text-gray-400"
                                : ""
                            }`}
                            placeholder="Enter Activities"
                            disabled={isDisabledLibur}
                          />
                        )}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Buttons */}
              <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
                <button
                  type="button"
                  onClick={addActivity}
                  className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  + Add Activity
                </button>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab(0)}
                    className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <PulseLoader size={4} color="#ffffff" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Card>
  );
};

export default EditTimesheet;
