"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ResponseGetBoardDetail } from "@/lib/types/board/response";

interface BoardFormProps {
  isEditMode?: boolean;
  boardId?: string;
  initialData?: ResponseGetBoardDetail;
}

export default function BoardForm({
  isEditMode = false,
  boardId,
  initialData,
}: BoardFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    categoryName: "",
    content: "",
  });

  // 이미지 관련 상태
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (isEditMode && initialData) {
      setPostData({
        title: initialData.title,
        categoryName: initialData.categoryName,
        content: initialData.content,
      });
      setImageUrl(initialData.boardImage || "");
    }
  }, [isEditMode, initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setPostData((prev) => ({ ...prev, categoryName: value }));
  };

  // 이미지 파일 선택 및 업로드
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // 이미지 서버에 업로드
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("http://localhost:8888/images/board", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          throw new Error("이미지 업로드 실패");
        }
        const data = await res.json();
        setImageUrl("http://localhost:8888" + data.file.url); // 이미지 서버가 반환하는 URL
      } catch (err) {
        alert("이미지 업로드에 실패했습니다.");
        setImageUrl("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      const requestBody = {
        title: postData.title,
        content: postData.content,
        categoryName: postData.categoryName,
        boardImage: imageUrl,
      };

      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api/boards/${boardId}`
        : `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api/boards`;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "요청 처리 중 오류가 발생했습니다."
        );
      }

      const result = await response.json();
      alert(result.message || "게시글이 등록되었습니다.");

      router.push(`/board/${boardId || result.boardId}`);
    } catch (error) {
      console.error("요청 실패:", error);
      alert(error instanceof Error ? error.message : "알 수 없는 오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
    >
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">
        {isEditMode ? "게시글 수정" : "게시글 작성"}
      </h1>
      <div className="space-y-6">
        <Select
          onValueChange={handleCategoryChange}
          value={postData.categoryName}
          name="categoryName"
        >
          <SelectTrigger className="w-64 p-4 border-gray-300 rounded-md">
            <SelectValue placeholder="카테고리를 선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="캠핑장">캠핑장</SelectItem>
            <SelectItem value="캠핑장비">캠핑장비</SelectItem>
            <SelectItem value="초보꿀팁">초보꿀팁</SelectItem>
          </SelectContent>
        </Select>

        <Input
          name="title"
          value={postData.title}
          onChange={handleInputChange}
          placeholder="제목을 입력하세요"
          className="w-full p-4 border-gray-300 rounded-md"
          required
        />

        <Textarea
          name="content"
          value={postData.content}
          onChange={handleInputChange}
          placeholder="내용을 입력하세요"
          className="min-h-[300px] w-full border border-gray-300 rounded-md resize-none p-4"
          required
        />

        <div>
          <label className="block mb-2 font-medium">이미지 업로드</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border-gray-300 rounded-md"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="미리보기"
              className="mt-4 max-h-48 rounded"
            />
          )}
        </div>

        <div className="flex justify-center pt-8">
          <Button
            type="submit"
            className="bg-[#7a8a65] hover:bg-[#4a6920] text-white px-12 py-3 rounded-md text-lg"
            disabled={isLoading}
          >
            {isLoading ? "처리 중..." : isEditMode ? "수정하기" : "게시하기"}
          </Button>
        </div>
      </div>
    </form>
  );
}
