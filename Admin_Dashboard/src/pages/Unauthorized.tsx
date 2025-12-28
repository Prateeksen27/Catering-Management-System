import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center bg-white border rounded-2xl p-8 shadow-sm">
        
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldOff className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Access Denied
        </h1>

        <p className="text-gray-600 mb-6">
          You do not have permission to view this page.
          Please contact an administrator if you believe this is a mistake.
        </p>

        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link to="/">Go to Dashboard</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link to="/login">Login Again</Link>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Unauthorized;
