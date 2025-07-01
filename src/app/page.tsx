import Link from "next/link";

import { LatestPost } from "@/app/_components/post";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  return(
  <div>
  <h1>Hello, world!</h1>
  <p>This is inline HTML in a TypeScript React component.</p>
</div>
  );
}
