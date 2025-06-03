import { AUTH_CONSTANTS } from "@/constants";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(AUTH_CONSTANTS.ROUTES.LOGIN);
}
