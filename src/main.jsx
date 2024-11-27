// src/index.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { ContactProvider } from "./contexts/ContactContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { CouponProvider } from "./contexts/CouponContext";
import { FAQProvider } from "./contexts/FAQContext";
import { TagProvider } from "./contexts/TagContext"; // Correctly import TagProvider
import { ReviewProvider } from "./contexts/ReviewContext"; // Import ReviewProvider
import { BrowserRouter as Router } from "react-router-dom";
import ErrorBoundary from "./components/Common/ErrorBoundary"; // Import ErrorBoundary
import "../src/styles/globals.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      {/* <ErrorBoundary> */}
        <AuthProvider>
          <UserProvider>
            <CategoryProvider>
              <CouponProvider>
                <FAQProvider>
                  <TagProvider>
                    <ReviewProvider> {/* Add ReviewProvider */}
                      <ContactProvider>
                        <AppRoutes />
                      </ContactProvider>
                    </ReviewProvider>
                  </TagProvider>
                </FAQProvider>
              </CouponProvider>
            </CategoryProvider>
          </UserProvider>
        </AuthProvider>
      {/* </ErrorBoundary> */}
    </Router>
    <Toaster position="top-right" reverseOrder={false} />
  </React.StrictMode>
);
