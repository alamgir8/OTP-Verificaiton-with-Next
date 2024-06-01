"use client";
import PhoneAuth from "./components/PhoneAuth";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white text-gray-950">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <PhoneAuth />
      </div>
    </main>
  );
}
