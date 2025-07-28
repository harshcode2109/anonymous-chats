import React from "react";
import PopularPosts from "../components/PopularPosts";
import AllPosts from "../components/AllPosts";
import Suggestion from "../components/Suggestion";
import { useSelector } from "react-redux";

export default function Home() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div
      className={`w-full min-h-screen pt-20 flex justify-center ${
        theme === "dark" ? "bg-background-dark" : "bg-[#F0F2F5]"
      }`}
    >
      <div className="w-full max-w-[1400px]  flex flex-col md:flex-row gap-2 items-start">
        
        {/* Left: Popular Posts */}
        <div className="w-full md:w-[35%] order-1 md:order-1">
          <div className="bg-card rounded-2xl p-2 h-full">
            <PopularPosts />
          </div>
        </div>

        {/* Right: Suggestions (2nd on mobile) */}
        <div className="w-full md:w-[25%] order-2 md:order-3">
          <div className="bg-card rounded-2xl p-2 h-full">
            <Suggestion />
          </div>
        </div>

        {/* Center: All Posts (last on mobile) */}
        <div className="w-full md:w-[55%] order-3 md:order-2">
          <div className="bg-card rounded-2xl p-2 h-full">
            <AllPosts />
          </div>
        </div>
        
      </div>
    </div>
  );
}
