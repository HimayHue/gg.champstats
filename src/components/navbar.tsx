import { FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Navbar: FC = () => {

   return (
      <nav className={cn("w-full flex items-center justify-between px-6 py-4 border-b bg-background")}>
         <span className="text-xl font-bold tracking-tight"><a href="/">Champ Stats</a></span>
      </nav>
   );
};

export default Navbar;