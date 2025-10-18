import { Button, Checkbox, em, Loader, NativeSelect, PasswordInput, TextInput } from "@mantine/core";
import { IconAt, IconLock } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";


const SignIn = () => {
    const [empID, setEmpID] = useState("");
    const [password, setPassword] = useState("");
    const [empType, setEmpType] = useState("Admin");
    const { login, isLoading } = useAuthStore()
    const types = ["Admin", "Manager", "Driver","Worker","Chef"]
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        login(empID, password, empType)
    }
    return (
        <form className="flex flex-col justify-center gap-4 bg-card text-foreground">
            {/* Title */}
            <div className="text-3xl font-semibold text-foreground mb-2">
                Welcome Back 👋
            </div>
            <p className="text-muted-foreground mb-6">
                Login to your account
            </p>

            {/* Email Field */}
            <TextInput
                leftSection={<IconAt size={18} />}
                label="Employee Id"
                value={empID}
                onChange={(e) => setEmpID(e.currentTarget.value)}
                placeholder="EMP00X"
                withAsterisk
                styles={{
                    label: { color: "hsl(var(--foreground))" },
                }}
            />

            {/* Password Field */}
            <PasswordInput
                leftSection={<IconLock size={18} />}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                placeholder="Enter your password"
                withAsterisk
                styles={{
                    label: { color: "hsl(var(--foreground))" },
                }}
            />
            <NativeSelect value={empType} onChange={(e) => setEmpType(e.currentTarget.value)} label="Choose Type" withAsterisk data={types} />

            {/* Options Row */}
            <div className="flex items-center justify-between mt-2">
                <Checkbox
                    color="blue"
                    label="Remember me"
                    className="text-muted-foreground"
                />
                <Link
                    to="/forgot-password"
                    className="text-primary hover:text-primary-hover text-sm hover:underline transition"
                >
                    Forgot Password?
                </Link>
            </div>

            {/* Login Button */}
            <Button
                onClick={handleSubmit}
                variant="filled"
                color="blue"
                className="bg-primary flex gap-3 w-full justify-center hover:bg-primary-hover text-primary-foreground font-semibold py-2 mt-3 transition"
                radius="md"
            >

                {isLoading && <Loader size="xs" className="m-2" color="white" />}

                Login
            </Button>

        </form>
    );
};

export default SignIn;
