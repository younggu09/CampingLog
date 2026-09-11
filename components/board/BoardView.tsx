"use client";

import { ResponseGetBoardByCategory } from "@/lib/types/board/response";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import Link from "next/link";
import BoardList from "./BoardList";

interface BoardViewProps {
  boards: ResponseGetBoardByCategory[];
  categoryTitle: string;
}

export default function BoardView({ boards, categoryTitle }: BoardViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#333333]">{categoryTitle}</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-[#cccccc]">
            <span className="text-[#333333]">최신순</span>
            <span>|</span>
            <span>댓글순</span>
          </div>
          <Link href="/board/write" passHref>
            <Button className="bg-[#7a8a65] hover:bg-[#4a6920]">글쓰기</Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Select defaultValue="제목">
          <SelectTrigger className="w-24 border-[#cccccc]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="제목">제목</SelectItem>
            <SelectItem value="내용">내용</SelectItem>
            <SelectItem value="작성자">작성자</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="검색어를 입력하세요"
            className="pr-10 border-[#cccccc]"
          />
          <Button
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-[#7a8a65] hover:bg-[#4a6920]"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <BoardList boards={boards} />

      <div className="flex justify-center items-center space-x-2 py-8">
        <Button variant="ghost" size="sm" className="text-[#cccccc]">
          «
        </Button>
        <Button variant="ghost" size="sm" className="text-[#cccccc]">
          ‹
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="bg-[#7a8a65] text-white hover:bg-[#4a6920]"
        >
          1
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#333333] hover:bg-[#faf6f0]"
        >
          2
        </Button>
        <Button variant="ghost" size="sm" className="text-[#cccccc]">
          ›
        </Button>
        <Button variant="ghost" size="sm" className="text-[#cccccc]">
          »
        </Button>
      </div>
    </div>
  );
}
