import React, { useState } from "react";
import YouTube from "react-youtube";
import { dummyTrailers } from "../assets/assets";
import BlurCircle from "./BlurCircle";

const TrailerMovie = () => {
  const [current, setCurrent] = useState(dummyTrailers[0]);

  const getVideoId = (url) => {
    return url.split("v=")[1]?.split("&")[0];
  };

  const opts = {
    width: "100%",
    height: "540",
    playerVars: {
      controls: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">Trailers</p>

      <div className="relative mt-6 max-w-[960px] mx-auto rounded-xl overflow-hidden">
        <BlurCircle top="-100px" right="-100px" />

        <div className="rounded-xl overflow-hidden">
          <YouTube videoId={getVideoId(current.videoUrl)} opts={opts} />
        </div>
      </div>

      {/* Thumbnail List */}
      <div className="flex gap-4 overflow-x-auto mt-6 pb-2 max-w-[960px] mx-auto">
        {dummyTrailers.map((t, i) => {
          const active = t === current;
          return (
            <img
              key={i}
              src={t.image}
              onClick={() => setCurrent(t)}
              className={`w-40 h-24 rounded-lg object-cover cursor-pointer transition-all border 
                ${active ? "border-primary opacity-100" : "opacity-60 hover:opacity-100"}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TrailerMovie;
