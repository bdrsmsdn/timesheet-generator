import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "components/card";
import { ArrowLeft, ArrowRight, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Rin, PulseLoader } from "react-spinners";

const TimesheetView = () => {
  const { id } = useParams();
  //   const id = "67aa05c95159ebb65fa9af72";
  const navigate = useNavigate();
  const [timesheet, setTimesheet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimesheetDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_URL_API}/api/timesheet/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTimesheet(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch timesheet details");
        navigate("/user/timesheets");
        setLoading(false);
      }
    };

    fetchTimesheetDetails();
  }, [id, navigate]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots) => (
      <div>
        <ul className="custom-dots">{dots}</ul>
      </div>
    ),
  };

  const typeMapping = {
    LS: "Libur",
    LM: "Libur",
    H: "Hadir",
    C: "Cuti",
    S: "Sakit",
    I: "Izin",
    L: "Libur",
  };

  const typeLibur = {
    LS: "Sabtu",
    LM: "Minggu",
  };

  if (loading) {
    return (
      <Card extra="w-full h-full px-6 pb-6">
        <div className="flex h-40 items-center justify-center">
          <PulseLoader size={10} color="blue" />
        </div>
      </Card>
    );
  }

  if (!timesheet) {
    return (
      <Card extra="w-full h-full px-6 pb-6">
        <div className="text-center text-gray-500">No timesheet found</div>
      </Card>
    );
  }

  return (
    <Card extra="w-full h-full px-6 pb-6">
      <div className="mb-6 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/user/data-tables")}
            className="text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">
            Timesheet Details
          </h2>
        </div>
      </div>

      {/* Timesheet Details */}
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Divisi
            </label>
            <p className="mt-1 text-navy-700 dark:text-white">
              {timesheet.divisi?.name || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Department
            </label>
            <p className="mt-1 text-navy-700 dark:text-white">
              {timesheet.department?.name || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Team
            </label>
            <p className="mt-1 text-navy-700 dark:text-white">
              {timesheet.team?.name || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Vendor
            </label>
            <p className="mt-1 text-navy-700 dark:text-white">
              {timesheet.vendor?.name || "N/A"}
            </p>
          </div>
        </div>

        {/* Period Information */}
        <div className="border-t pt-6 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold text-navy-700 dark:text-white">
            Period Details
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Month
              </label>
              <p className="mt-1 text-navy-700 dark:text-white">
                {new Date(2025, timesheet.month - 1).toLocaleString("default", {
                  month: "long",
                })}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Year
              </label>
              <p className="mt-1 text-navy-700 dark:text-white">
                {timesheet.year}
              </p>
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="border-t pt-6 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold text-navy-700 dark:text-white">
            Activities
          </h3>
          <Slider className="mb-6" {...settings}>
            {timesheet.activities.map((activity, index) => (
              <div key={index} className="p-4">
                <div className="rounded-lg border p-4 dark:border-gray-700">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Type
                      </label>
                      <p className="mt-1 text-navy-700 dark:text-white">
                        {typeMapping[activity.type] || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Date
                      </label>
                      <p className="mt-1 text-navy-700 dark:text-white">
                        {activity.date
                          ? new Date(activity.date).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Check In
                      </label>
                      <p className="mt-1 text-navy-700 dark:text-white">
                        {activity.clockIn || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Check Out
                      </label>
                      <p className="mt-1 text-navy-700 dark:text-white">
                        {activity.clockOut || "N/A"}
                      </p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-4">
                      <label className="block text-sm font-medium text-gray-600">
                        Project
                      </label>
                      <p className="mt-1 text-navy-700 dark:text-white">
                        {activity.project || "N/A"}
                        {activity.projectCode
                          ? ` (${activity.projectCode})`
                          : ""}
                      </p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-4">
                      <label className="block text-sm font-medium text-gray-600">
                        Activities
                      </label>
                      <p className="mt-1 text-navy-700 dark:text-white">
                        {activity.type === "LS" || activity.type === "LM"
                          ? typeLibur[activity.type]
                          : activity.activities || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
          {/* Custom CSS untuk arrow dan dot */}
          <style>{`
        /* Warna arrow default */
        .slick-prev, .slick-next {
          width: 30px;
          height: 30px;
          z-index: 10;
          color: #000000; /* Biru */
        }
        .slick-prev:hover, .slick-next:hover {
          color: #1E3A8A; /* Biru tua */
        }
        .slick-prev {
          left: -15px;
        }
        .slick-next {
          right: -15px;
        }

        /* Warna arrow mode gelap */
        .dark .slick-prev, .dark .slick-next {
          color: #FACC15; /* Kuning */
        }
        .dark .slick-prev:hover, .dark .slick-next:hover {
          color: #EAB308; /* Kuning tua */
        }

        /* Warna dots */
        .custom-dots li button:before {
          color: #4A90E2; /* Biru */
          opacity: 0.7;
        }
        .custom-dots li.slick-active button:before {
          color: #1E3A8A; /* Biru tua */
          opacity: 1;
        }

        /* Warna dots mode gelap */
        .dark .custom-dots li button:before {
          color: #A6AAB9;
          opacity: 0.7;
        }
        .dark .custom-dots li.slick-active button:before {
          color: #FFFFF;
          opacity: 1;
        }
      `}</style>
        </div>
      </div>
    </Card>
  );
};

export default TimesheetView;
