import React, { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import axios from "axios";
import { Download, Plus, Eye, Edit, Trash } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import Card from "components/card";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import qrCode from "../../../../assets/img/qrCode.png";
import Confetti from "react-confetti";

const columnHelper = createColumnHelper();

const TimesheetList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const images = [
    "https://media.giphy.com/media/x4dS8uOkeEFdxvV1nz/giphy.gif?cid=790b76113li8bliiywdn1ld8sjeoes3gfgtk719ul75hisbk&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2xpOGJsaWl5d2RuMWxkOHNqZW9lczNnZmd0azcxOXVsNzVoaXNiayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26gsjCZpPolPr3sBy/giphy.gif",
    "https://media.giphy.com/media/7rwS6e59S26Ozzud2o/giphy.gif?cid=ecf05e47a0lg8yiwx6t81gwxwl5xrny9lh4n9lxxet3wluhr&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/Ld0D47JNsUSxcPEhm9/giphy.gif?cid=ecf05e47kr1xcpxhjgkik8p2lz283lgx4cyb6kdsaranbvo9&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif?cid=ecf05e47hd3ug1slnsatc90me1g65e6kx4mdja9e86aa1c2q&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/xUA7aN1MTCZx97V1Ic/giphy.gif?cid=ecf05e47kr1xcpxhjgkik8p2lz283lgx4cyb6kdsaranbvo9&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/rpprIxlWODdRhmEHkT/giphy.gif?cid=ecf05e47exvw3gm3xi4abf4u9hkx5kvtnlooeynngils4qnu&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/RipfZWzjUDH25euMpM/giphy.gif?cid=ecf05e47exvw3gm3xi4abf4u9hkx5kvtnlooeynngils4qnu&ep=v1_gifs_search&rid=giphy.gif&ct=g",
  ];

  const getRandomImage = () => {
    return images[Math.floor(Math.random() * images.length)];
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const columns = [
    // Kolom nomor urutan
    columnHelper.accessor((row, index) => index + 1, {
      id: "no",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">NO.</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
      size: 50, // Lebar kolom 50px
    }),
    columnHelper.accessor((row) => `${months[row.month - 1]} ${row.year}`, {
      id: "period",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          PERIOD
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
      size: 150, // Lebar kolom 150px
    }),
    columnHelper.accessor("vendor.name", {
      id: "vendor",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          VENDOR
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
      size: 150, // Lebar kolom 150px
    }),
    // Kolom Action
    columnHelper.display({
      id: "actions",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          ACTIONS
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center gap-2">
          {/* Tombol View */}
          <button
            className="flex items-center justify-center rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
            onClick={() => handleView(info.row.original._id)}
          >
            <Eye className="h-4 w-4" />
          </button>
          {/* Tombol Edit */}
          <button
            className="flex items-center justify-center rounded-md bg-green-500 p-2 text-white hover:bg-green-600"
            onClick={() => handleEdit(info.row.original._id)}
          >
            <Edit className="h-4 w-4" />
          </button>
          {/* Tombol Delete */}
          <button
            className="flex items-center justify-center rounded-md bg-red-500 p-2 text-white hover:bg-red-600"
            onClick={() => handleDelete(info.row.original._id)}
          >
            <Trash className="h-4 w-4" />
          </button>
          {/* Tombol Download */}
          <button
            className="flex items-center justify-center rounded-md bg-purple-500 p-2 text-white hover:bg-purple-600"
            onClick={() => handleDownload(info.row.original._id)}
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      ),
      size: 200, // Lebar kolom 200px
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      // Ambil token dari localStorage
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.REACT_APP_URL_API}/api/timesheet/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.timesheets);
    } catch (error) {
      toast.error("Error fetching timesheet, please refresh this browser.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler untuk tombol View
  const handleView = (rowData) => {
    navigate(`/user/view-timesheet/${rowData}`);
  };

  // Handler untuk tombol Edit
  const handleEdit = (rowData) => {
    navigate(`/user/edit-timesheet/${rowData}`);
  };

  const handleDelete = async (rowData) => {
    try {
      const token = localStorage.getItem("token");

      // Konfirmasi sebelum menghapus
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return;

      setLoading(true); // Set loading sebelum proses

      // Request DELETE ke API
      await axios.delete(
        `${process.env.REACT_APP_URL_API}/api/timesheet/${rowData}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchData(); // Ambil data terbaru setelah delete

      // Tampilkan pesan sukses
      toast.success("Timesheet has been deleted.");
    } catch (error) {
      toast.error("Error deleting timesheet, please try again later.");
    } finally {
      setLoading(false); // Matikan loading setelah proses selesai
    }
  };

  // Handler untuk tombol Download
  const handleDownload = async (rowData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.REACT_APP_URL_API}/api/timesheet/download/${rowData}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      // Buat URL dari blob
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);

      // Buat elemen <a> untuk mengunduh file
      const a = document.createElement("a");
      a.href = url;
      a.download = `Timesheet_${rowData}.xlsx`; // Ganti nama file sesuai kebutuhan
      document.body.appendChild(a);
      a.click();

      // Bersihkan setelah download
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setShowConfetti(true);

      const randImage = getRandomImage();

      Swal.fire({
        title: "Download Successful!🎉🦄",
        text: "Thank you for downloading. If you find this helpful, consider supporting me by Scan QR above!😘",
        imageUrl: qrCode,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "QR Code for Donation",
        confirmButtonText: "Close",
        didClose: () => {
          setShowConfetti(false);
        },
        backdrop: `
    rgba(0,0,123,0.4)
    url(${randImage})
    left top
    no-repeat
  `,
      });
    } catch (error) {
      toast.error("Error downloading timesheet, please try again later.");
    }
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Timesheets
          </div>
          <button
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            onClick={() => {
              navigate("/user/add-timesheet");
            }}
          >
            <Plus className="h-4 w-4" />
            Add Timesheet
          </button>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Desktop View - Regular Table */}
              <div className="hidden sm:block">
                <table className="w-full">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr
                        key={headerGroup.id}
                        className="!border-px !border-gray-400"
                      >
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start"
                            style={{ width: header.column.getSize() }}
                          >
                            <div className="text-xs font-bold text-gray-600">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="min-w-[150px] border-white/0 py-3 pr-4"
                              style={{ width: cell.column.getSize() }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={
                            table.getHeaderGroups()[0]?.headers.length || 1
                          }
                          className="py-4 text-center text-gray-500"
                        >
                          No entries found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile View - Card Layout */}
              <div className="space-y-4 sm:hidden">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <div
                      key={row.id}
                      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-navy-800"
                    >
                      {row.getVisibleCells().map((cell) => {
                        // Get the header text safely
                        const headerContent = flexRender(
                          cell.column.columnDef.header,
                          cell.getContext()
                        );

                        return (
                          <div key={cell.id} className="mb-2 flex flex-col">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              {typeof headerContent === "string"
                                ? headerContent
                                : cell.column.id}
                            </span>
                            <div className="mt-1">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">
                    No entries found
                  </div>
                )}
              </div>

              {/* Pagination Controls - Responsive */}
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600">
                  Showing {table.getRowModel().rows.length} of {data.length}{" "}
                  entries
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50 sm:flex-none"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </button>
                  <button
                    className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50 sm:flex-none"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </>
  );
};

export default TimesheetList;
