import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-24">
      <h1>Jake Is Trash</h1>
      <div className="text-center">
        <h1 className="text-xl font-bold">Quick Profiles Searches</h1>
        <ul className="flex flex-col gap-y-3 text-blue-500">
          <li>
            <a href="/lol/na/Radec%20Himay-NA1">Radec Himay#NA1</a>
          </li>
          <li >
            <a href="/lol/na/Radec%20Jake-NA1">Radec Jake#NA1</a>
          </li>
        </ul>
      </div>

    </main>
  );
}
