import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function SheetMusicRedirect({ searchParams }: Props) {
  const params = await searchParams;
  const url = new URL("/pieces", "http://localhost");
  if (params.password && typeof params.password === "string") {
    url.searchParams.set("password", params.password);
  }
  redirect(url.pathname + url.search);
}
