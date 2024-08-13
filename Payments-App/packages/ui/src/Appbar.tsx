import { Button } from "./button";

interface AppbarProps {
  user?: {
    name?: string | null;
  };
  onSignin: any;
  onSignout: any;
}

export const Appbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 shadow-md">
      <div className="text-xl font-bold flex items-center">
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c.837 0 1.657-.24 2.353-.692m1.947-1.268A7.962 7.962 0 0119.5 8.5m0 0A7.963 7.963 0 0115 12M8 16a7.963 7.963 0 00-4.5-3.5M19.5 8.5L12 8m7.5 0l-3.2 5.4a7.963 7.963 0 01-2.353.692m-6.293-6.268A7.962 7.962 0 014.5 8.5m0 0a7.963 7.963 0 015.5 4M8 16c.837 0 1.657-.24 2.353-.692m1.947-1.268A7.962 7.962 0 0012 12m0 0a7.963 7.963 0 014.5 4m-4.5 0a7.963 7.963 0 01-4.5 0m9 0a7.963 7.963 0 01-4.5 0m0 0L12 12"
          ></path>
        </svg>
        PayTM
      </div>
      <div className="flex items-center">
        {user && (
          <div className="mr-4">
            <span className="text-sm">Welcome, {user.name || "Guest"}</span>
          </div>
        )}
        <Button onClick={user ? onSignout : onSignin}>
          {user ? "Logout" : "Login"}
        </Button>
      </div>


      
    </div>
  );
};
