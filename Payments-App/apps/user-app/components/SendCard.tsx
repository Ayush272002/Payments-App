"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import { toast } from "react-toastify";

export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    try {
      const result = await p2pTransfer(number, Number(amount) * 100);

      if (result.statusCode === 200) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="h-[40vh] ml-[-10rem]">
      <Center>
        <Card title="Send">
          <div className="min-w-72 pt-2">
            <TextInput
              placeholder={"Number"}
              label="Number"
              onChange={(value) => {
                setNumber(value);
              }}
            />
            <TextInput
              placeholder={"Amount"}
              label="Amount"
              onChange={(value) => {
                setAmount(value);
              }}
            />
            <div className="pt-4 flex justify-center">
              <Button onClick={handleTransfer}>Send</Button>
            </div>
          </div>
        </Card>
      </Center>
    </div>
  );
}
