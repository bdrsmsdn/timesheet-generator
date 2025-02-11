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
import { useNavigate } from "react-router-dom";
import CustomSelect from "./CustomSelect";
import { PulseLoader } from "react-spinners";
import Swal from "sweetalert2/dist/sweetalert2.js";

const AddTimesheetForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [activeTab, setActiveTab] = useState(0);
  const [activities, setActivities] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tokenData, setTokenData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setTokenData(decodedToken);
    }
  }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [vendorsRes, departmentsRes, divisionsRes, teamsRes] =
          await Promise.all([
            axios.get(`${process.env.REACT_APP_URL_API}/api/vendor`, {
              headers,
            }),
            axios.get(`${process.env.REACT_APP_URL_API}/api/department`, {
              headers,
            }),
            axios.get(`${process.env.REACT_APP_URL_API}/api/divisi`, {
              headers,
            }),
            axios.get(`${process.env.REACT_APP_URL_API}/api/team`, { headers }),
          ]);

        setVendors(vendorsRes.data);
        setDepartments(departmentsRes.data);
        setDivisions(divisionsRes.data);
        setTeams(teamsRes.data);
      } catch (error) {
        setError(error);
        toast.error("Failed to fetch dropdown data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {}, [activities]);

  const addActivity = () => {
    setActivities([
      ...activities,
      {
        date: "",
        clockIn: "",
        clockOut: "",
        project: "",
        projectCode: "",
        activities: "",
      },
    ]);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const filteredData = {
        ...data,
        activities: data.activities.map(({ type, ...rest }) => rest), // Hapus field `type`
      };
      console.log(filteredData);

      const token = localStorage.getItem("token");

      await axios.post(
        `${process.env.REACT_APP_URL_API}/api/timesheet`,
        filteredData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Timesheet submitted successfully");

      reset();
      navigate("/user/data-tables");
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    { value: "H", label: "Hadir" },
    { value: "C", label: "Cuti" },
    { value: "S", label: "Sakit" },
    { value: "I", label: "Izin" },
  ];

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
            Create Timesheet
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
                  defaultValue={tokenData?.vendor || ""}
                  disabled={!!tokenData?.vendor}
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

              {/* Submit Button */}
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
              {activities.map((activity, index) => {
                const isDisabled = watch(`activities[${index}].type`) !== "H";

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
                            value={typeOptions.find(
                              (option) => option.value === field.value
                            )}
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption?.value)
                            }
                          />
                        )}
                      />
                    </div>

                    {/* Date, Check In, Check Out section - Responsive */}
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
                                className="w-full rounded border p-2 dark:border-gray-700 dark:bg-navy-800"
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

                    {/* Project Section - Responsive */}
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
                              isDisabled
                                ? "cursor-not-allowed bg-gray-100 dark:bg-navy-800 dark:text-gray-400"
                                : ""
                            }`}
                            placeholder="Enter Activities"
                            disabled={isDisabled}
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

export default AddTimesheetForm;
