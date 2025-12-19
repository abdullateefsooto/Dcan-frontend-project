import { FaHome, FaBox, FaPlus, FaUsers, FaPowerOff } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    // Clear token and user info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  };

  // Menu items (easier to maintain)
  const menuItems = [
    { icon: <FaHome />, label: "Overview", path: "/admin" },
    { icon: <FaPlus />, label: "Add Product", path: "/admin/upload" },
    { icon: <FaBox />, label: "Products", path: "/admin/products" },
    { icon: <FaUsers />, label: "Manage Users", path: "/admin/users" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed left-0 top-0 flex flex-col justify-between">
      {/* Logo / Header */}
      <div>
        <h1 className="text-2xl font-bold mb-10">Admin</h1>

        {/* Menu */}
        <ul className="space-y-6">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className="flex items-center gap-3 hover:text-gray-300 transition-colors duration-200"
              >
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout */}
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 hover:text-gray-300 mt-10 transition-colors duration-200"
        >
          <FaPowerOff /> Logout
        </button>
      </div>
    </div>
  );
}
