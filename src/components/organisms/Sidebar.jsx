import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Sidebar = () => {
  const navItems = [
    { to: "/", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "/courses", icon: "BookOpen", label: "Courses" },
    { to: "/assignments", icon: "ClipboardList", label: "Assignments" },
    { to: "/schedule", icon: "Calendar", label: "Schedule" },
    { to: "/grades", icon: "TrendingUp", label: "Grades" }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
            <ApperIcon name="GraduationCap" className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Study Hub
            </h1>
            <p className="text-xs text-gray-600">Student Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon name={item.icon} size={20} />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-accent/10 to-orange-100 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Sparkles" className="text-white" size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1">Study Tip</h3>
              <p className="text-xs text-gray-600">Break large assignments into smaller tasks for better focus.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;