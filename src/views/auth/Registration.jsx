import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "components/fields/InputField";
import Select from "react-select";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [options, setOptions] = useState({
    divisi: [],
    department: [],
    team: [],
  });

  // State untuk input form
  const [formData, setFormData] = useState({
    name: "",
    npp: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "staff",
    fullName: "",
    divisi: null,
    department: null,
    team: null,
  });

  // Fetch dropdown data dari API
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [divisionsRes, departmentsRes, teamsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_URL_API}/api/divisi`),
          axios.get(`${process.env.REACT_APP_URL_API}/api/department`),
          axios.get(`${process.env.REACT_APP_URL_API}/api/team`),
        ]);

        setOptions({
          divisi: divisionsRes.data,
          department: departmentsRes.data,
          team: teamsRes.data,
        });
      } catch (err) {
        setError("Failed to load dropdown data");
      } finally {
        setDropdownLoading(false);
      }
    };
    fetchDropdownData();
  }, []);

  // Handle perubahan input form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle perubahan dropdown pake react-select
  const handleSelectChange = (name, selectedOption) => {
    setFormData({ ...formData, [name]: selectedOption });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Format data sebelum dikirim
    const formattedData = {
      ...formData,
      divisi: formData.divisi?._id || "",
      department: formData.department?._id || "",
      team: formData.team?._id || "",
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL_API}/api/auth/register`,
        formattedData
      );

      if (response.data) {
        toast.success("Account created, please login to continue");
        navigate("/auth/sign-in");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Register
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your details to create an account
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              variant="auth"
              extra="mb-3"
              label="Name*"
              placeholder="Name"
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
            <InputField
              variant="auth"
              extra="mb-3"
              label="Npp*"
              placeholder="101101"
              id="npp"
              type="text"
              value={formData.npp}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              variant="auth"
              extra="mb-3"
              label="Email*"
              placeholder="user@example.com"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              variant="auth"
              extra="mb-3"
              label="Phone*"
              placeholder="123456789"
              id="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              variant="auth"
              extra="mb-3"
              label="Password*"
              placeholder="Password"
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <InputField
              variant="auth"
              extra="mb-3"
              label="Confirmation Password*"
              placeholder="Confirmation Password"
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <InputField
            variant="auth"
            extra="mb-3"
            label="Full Name*"
            placeholder="Full Name"
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
          />

          {/* Dropdowns */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Division*
              </label>
              <Select
                options={options.divisi}
                getOptionLabel={(e) => e.name}
                getOptionValue={(e) => e._id}
                isLoading={dropdownLoading}
                onChange={(selected) => handleSelectChange("divisi", selected)}
                value={formData.divisi}
                placeholder="Pilih Divisi"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Department*
              </label>
              <Select
                options={options.department}
                getOptionLabel={(e) => e.name}
                getOptionValue={(e) => e._id}
                isLoading={dropdownLoading}
                onChange={(selected) =>
                  handleSelectChange("department", selected)
                }
                value={formData.department}
                placeholder="Pilih Departemen"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Team*</label>
              <Select
                options={options.team}
                getOptionLabel={(e) => e.name}
                getOptionValue={(e) => e._id}
                isLoading={dropdownLoading}
                onChange={(selected) => handleSelectChange("team", selected)}
                value={formData.team}
                placeholder="Pilih Team"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Already have an account?
          </span>
          <button
            onClick={() => navigate("/auth/sign-in")}
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
