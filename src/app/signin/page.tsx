import { auth, signIn } from "@/auth";
import { LoginForm } from "@/components/client/form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import Link from 'next/link';
import { redirect } from "next/navigation";

const page = async () => {
    const session = await auth();

    if (session?.user) redirect('/');

    return (
        <div className='flex justify-center items-center h-dvh'>
            <Card className="w-[35vw]">
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
                <CardFooter className='flex flex-col gap-4'>
                    <span>Or</span>
                    <div className="flex justify-center gap-4">
                        <form action={async () => { "use server"; await signIn("google") }} className='flex justify-center gap-4'>
                            <Button type='submit' variant={"outline"}>Sign up with Google</Button>
                        </form>
                        <form action={async () => { "use server"; await signIn("facebook") }} className='flex justify-center gap-4'>
                            <Button type='submit' variant={"outline"}>Sign up with Facebook</Button>
                        </form>
                    </div>
                    <Link href="/signup">
                        Don't have an account? Signup
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default page