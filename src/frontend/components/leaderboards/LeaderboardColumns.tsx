import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import type { PlayerLeaderboard } from "./LeaderboardData";

const columnHelper = createColumnHelper<PlayerLeaderboard>();

export const columns = [
  columnHelper.accessor("rank", {
    id: "Rank",
    header: () => "Rank",
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor("rating", {
    id: "Rating",
    header: () => "Rating",
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor(
    (row) => (
      <div className="@flex @space-x-2 smallscreen:@space-x-4">
        <img
          className="@w-auto @h-4 smallscreen:@h-6 monitor:@h-8 [image-rendering:pixelated]"
          src={`img/nations/${row.army}.gif`}
          alt={row.army}
        />
        <Link
          className="@p-0 @m-0 @text-white hover:@text-primary @text-[1em]"
          href={row.profileLink}
        >
          {row.name}
        </Link>
      </div>
    ),
    {
      id: "Player",
      header: "Player",
      cell: (info) => info.getValue()
    }
  ),
  columnHelper.accessor("games", {
    id: "Games",
    header: () => "Games",
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor("winRate", {
    id: "Win Rate",
    header: () => "Win rate",
    cell: (info) => (
      <div className="@relative">
        <div className="@text-left @pl-4 @relative @w-full @h-full @z-10">
          {info.getValue().toFixed(2)} %
        </div>
        <div
          className="@w-full @h-full @absolute @left-0 @top-0 @bg-gradient-to-r @from-red-600/80 @to-primary/80 @rounded-2xl @z-0 @shadow-lg @shadow-black"
          style={{ width: `${info.getValue()}%` }}
        ></div>
      </div>
    )
  }),
  columnHelper.accessor("streak", {
    id: "Streak",
    header: () => "Streak",
    cell: (info) => (
      <>
        {info.getValue() > 0 ? (
          <div>{`${info.getValue()} ${info.getValue() > 10 ? "🔥" : ""}`}</div>
        ) : (
          <div className="@flex @flex-column @items-center @justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 14.375L18.526 8.6792L17.7409 9.46429L12.5 3.82069L5 6.875L0 0L3.75 10.625L11.9044 8.08506L15.0893 12.1159L14.3042 12.901L20 14.375ZM4.375 11.7395V20H0.625V12.9076L4.375 11.7395ZM19.375 15.5044V20H15.625V14.5339L19.375 15.5044ZM14.375 14.2104V20H10.625V13.2399L14.375 14.2104ZM9.375 10.1821V20H5.625V11.3502L9.375 10.1821Z"
                fill="#E7724C"
              />
            </svg>
          </div>
        )}
      </>
    )
  })
];
