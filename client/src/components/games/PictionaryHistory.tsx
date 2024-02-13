import React from "react";

interface IPictionaryHistory {}

export const PictionaryHistory: React.FC<IPictionaryHistory> = () => {
  return (
    <div className="grid p-8">
      <table className="table-auto overflow-auto">
        <thead>
          <tr className="bg-slate-200">
            <th className="py-2 text-start border-slate-300 border px-4">
              Name
            </th>
            <th className="py-2 text-start border-slate-300 border px-4">
              Activity
            </th>
            <th className="py-2 text-start border-slate-300 border px-4">
              Host
            </th>
            <th className="py-2 text-start border-slate-300 border px-4">
              Template By
            </th>
            <th className="py-2 text-start border-slate-300 border px-4">
              Invite Type
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Intro to CSS</td>
            <td className="border px-4 py-2">Adam</td>
            <td className="border px-4 py-2">858</td>
            <td className="border px-4 py-2">1,280</td>
            <td className="border px-4 py-2">1,280</td>
          </tr>
          <tr className="bg-gray-100">
            <td className="border px-4 py-2">
              A Long and Winding Tour of the History of UI Frameworks and Tools
              and the Impact on Design
            </td>
            <td className="border px-4 py-2">Adam</td>
            <td className="border px-4 py-2">112</td>
            <td className="border px-4 py-2">1,280</td>
            <td className="border px-4 py-2">1,280</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Intro to JavaScript</td>
            <td className="border px-4 py-2">Chris</td>
            <td className="border px-4 py-2">1,280</td>
            <td className="border px-4 py-2">1,280</td>
            <td className="border px-4 py-2">1,280</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
