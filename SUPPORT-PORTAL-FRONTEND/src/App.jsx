import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

/* PUBLIC */
import Home from "./pages/public/Home";
import PublicFAQ from "./pages/public/PublicFAQ";
import PublicKB from "./pages/public/PublicKB";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* ADMIN */
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageAgents from "./pages/admin/ManageAgents";
import ManageFAQs from "./pages/admin/ManageFAQs";
import ManageKnowledgeBase from "./pages/admin/ManageKnowledgeBase";
import Reports from "./pages/admin/Reports";

/* AGENT */
import AgentLayout from "./pages/agent/AgentLayout";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AssignedTickets from "./pages/agent/AssignedTickets";
import TicketDetails from "./pages/agent/TicketDetails";

/* CUSTOMER */
import CustomerLayout from "./pages/customer/CustomerLayout";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerTicketDetails from "./pages/customer/TicketDetails";
import FAQ from "./pages/customer/FAQ";
import KnowledgeBase from "./pages/customer/KnowledgeBase";
import Tickets from "./pages/customer/Tickets";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<PublicFAQ />} />
          <Route path="/kb" element={<PublicKB />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/agents"
            element={
              <ProtectedRoute role="admin">
                <ManageAgents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/faqs"
            element={
              <ProtectedRoute role="admin">
                <ManageFAQs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/kb"
            element={
              <ProtectedRoute role="admin">
                <ManageKnowledgeBase />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute role="admin">
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* AGENT */}
          <Route
            path="/agent"
            element={
              <ProtectedRoute role="agent">
                <AgentLayout>
                  <AgentDashboard />
                </AgentLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/agent/tickets"
            element={
              <ProtectedRoute role="agent">
                <AgentLayout>
                  <AssignedTickets />
                </AgentLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/agent/tickets/:id"
            element={
              <ProtectedRoute role="agent">
                <AgentLayout>
                  <TicketDetails />
                </AgentLayout>
              </ProtectedRoute>
            }
          />

          {/* CUSTOMER */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute role="customer">
                <CustomerLayout>
                  <Tickets />
                </CustomerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/create"
            element={
              <ProtectedRoute role="customer">
                <CustomerLayout>
                  <CustomerDashboard />
                </CustomerLayout>
              </ProtectedRoute>
            }
          />

          {/* FIXED CUSTOMER TICKET DETAILS ROUTE */}
          <Route
            path="/customer/tickets/:id"
            element={
              <ProtectedRoute role="customer">
                <CustomerLayout>
                  <CustomerTicketDetails />
                </CustomerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/faqs"
            element={
              <ProtectedRoute role="customer">
                <CustomerLayout>
                  <FAQ />
                </CustomerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/kb"
            element={
              <ProtectedRoute role="customer">
                <CustomerLayout>
                  <KnowledgeBase />
                </CustomerLayout>
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;