"use client";
import { credentialsLogin } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const LoginForm = () => {
    return (
        <form action={async (formData) => {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            if (!email && !password)
                return toast.error("Please provide all fields");

            const toastId = toast.loading("Signing in...");

            const error = await credentialsLogin(email, password);

            if (!error) {
                toast.success("Signed in successfully", {
                    id: toastId,
                });
            }
            else toast.error(String(error), {
                id: toastId,
            });

        }} className='flex flex-col gap-4'>
            <Input type="email" placeholder='Email' name="email" />
            <Input type="password" placeholder='Password' name="password" />
            <Button type='submit'>Sign in</Button>
        </form>
    )
}

export { LoginForm };

