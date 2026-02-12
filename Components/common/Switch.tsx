//import { useState } from "react";

export default function Switch({ checked, onChange }: any) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 flex items-center rounded-full cursor-pointer transition ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </div>
  );
}
