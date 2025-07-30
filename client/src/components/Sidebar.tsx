import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { DotIcon, ShipWheelIcon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const curentPath = location.pathname;

  return (
    <div
      className="w-64 bg-base-200 border-r border-base-200 hidden md:flex
    flex-col h-screen top-0"
    >
      <div className="p-5 border-b border-base-300">
        <Link to={"/"} className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span
            className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r
        from-primary to-secondary tracking-wider"
          >
            SoChat
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to={"/"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case rounded-full
            ${curentPath === "/" ? "btn-active" : ""}`}
        >
          <DynamicIcon
            name={"home"}
            className="size-5 text-base-content opacity-70"
          />
          <span className="">Home</span>
        </Link>

        <Link
          to={"/friends"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case rounded-full
            ${curentPath === "/friends" ? "btn-active" : ""}`}
        >
          <DynamicIcon
            name={"users"}
            className="size-5 text-base-content opacity-70"
          />
          <span className="">Friends</span>
        </Link>

        <Link
          to={"/notification"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case rounded-full
            ${curentPath === "/notification" ? "btn-active" : ""}`}
        >
          <DynamicIcon
            name={"bell"}
            className="size-5 text-base-content opacity-70"
          />
          <span className="">Notification</span>
        </Link>
      </nav>

      <div className="absolute flex items-center gap-2 bottom-1 left-1">
        <div className="avatar size-10">
          <img src={authUser.profilePic} alt="" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-bold font-mono">{authUser.fullName}</p>
          {authUser.isOnBoarded ? (
            <div className="flex items-center">
              <DotIcon className="text-green-500" />
              <p className="text-xs text-green-500">Online</p>
            </div>
          ) : (
            <p className="text-xs text-red-400">Offline</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
