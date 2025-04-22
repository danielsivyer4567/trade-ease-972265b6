import { Outlet } from "react-router-dom";
import SettingsLayout from "./SettingsLayout";

export default function SettingsPage() {
  return (
    <SettingsLayout>
      <Outlet />
    </SettingsLayout>
  );
} 