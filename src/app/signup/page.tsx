import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { connectToDatabase } from "@/lib/utils";
import { User } from "@/models/userModel";
import { hash } from "bcryptjs";
import Link from 'next/link';
import { redirect } from "next/navigation";

const page = async () => {
    const session = await auth();

    if (session?.user) redirect('/');

    const handleSignUp = async (formData: FormData) => {
        "use server";

        const name = formData.get("name") as string | undefined;
        const email = formData.get("email") as string | undefined;
        const password = formData.get("password") as string | undefined;

        if (!name && !email && !password)
            throw new Error("Please provide all fields");

        await connectToDatabase();

        const user = await User.findOne({ email });

        if (user)
            throw new Error("User already exists");

        const hashedPassword = await hash(password, 10);

        await User.create({ name, email, password: hashedPassword });

        redirect("/signin");
    }
    return (
        <div className='flex justify-center items-center h-dvh'>
            <Card className="w-[35vw]">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSignUp} className='flex flex-col gap-4'>
                        <Input placeholder='Name' name="name" />
                        <Input type="email" placeholder='Email' name="email" />
                        <Input type="password" placeholder='Password' name="password" />
                        <Button type='submit'>Sign Up</Button>
                    </form>
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
                    <Link href="/signin">
                        Already have an account? Signin
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default page