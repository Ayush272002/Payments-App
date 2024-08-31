"use client";

import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { InputBox } from "@repo/ui/inputbox";
import { SubHeading } from "@repo/ui/subheading";
import { useState } from "react";
import { createUser } from "../../../lib/actions/createUser";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { BottomWarning } from "@repo/ui/bottomwarning";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !number || !password || !confirmPassword) {
      toast.error("Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const response = await createUser({ name, email, number, password });

    if (response && response.status >= 400) {
      toast.error(response.message);
    } else if (response && response.status === 201) {
      router.push("/api/auth/signin");
      toast.success("User created successfully sigin now");
    } else if (!response) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign Up"} />
          <SubHeading label={"Enter your information to create an account"} />

          <InputBox
            placeholder="Enter your name"
            label={"Name"}
            onChange={(e) => setName(e.target.value)}
          />

          <InputBox
            placeholder="Enter your email"
            label={"Email"}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputBox
            placeholder="Enter your phone number"
            label={"Phone Number"}
            onChange={(e) => setNumber(e.target.value)}
          />

          <InputBox
            placeholder="Enter your password"
            label={"Password"}
            inputType="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputBox
            placeholder="Confirm your password"
            label={"Confirm Password"}
            inputType="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="pt-4">
            <Button onClick={handleSignup}>Sign Up</Button>
          </div>

          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Log In"}
            to={"/api/auth/signin"}
          />
        </div>
      </div>
    </div>
  );
}
