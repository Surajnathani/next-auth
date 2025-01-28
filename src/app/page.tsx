import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { cookies } from "next/headers";
// import { decode, encode } from "next-auth/jwt";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  console.log(user);
  // const cookess = cookies.get("authjs.session-token");
  // console.log(await decode({
  //   token: cookess?.value!,
  //   salt: cookess?.name!,F
  //   secret: process.env.AUTH_SECRET!,
  // }))
  return (
    <div>
      {
        user ?
          <>
            <form action={async () => { "use server"; await signOut() }} className='flex justify-center gap-4'>
              <Button type='submit' variant={"outline"}>Sign out</Button>
            </form>
          </> :
          <Link href="signup">Signin</Link>
      }
    </div>
  );
}
