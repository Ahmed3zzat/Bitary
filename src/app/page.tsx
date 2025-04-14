import { redirect } from "next/navigation";

export default function MainPage() {
  redirect("/welcome"); // Automatically redirects the user
}
