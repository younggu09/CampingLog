"use client";

import { ResponseGetCampDetail } from "@/lib/types/camps/response";
import { MapPin, Phone, Globe, Calendar, Building, Layers, Droplets } from "lucide-react";
import InfoRow from "./InfoRow";

interface CampDetailProps {
    camp: ResponseGetCampDetail;
}

function CampDetail({ camp }: CampDetailProps ) {
    return (
        <div className="mt-5 mb-10">
            
            <div className="flex mb-4 gap-8">
                <div className="w-1/2 max-h-96">
                    <img
                      src={camp.firstImageUrl || "/image/camp-default.png"}
                      alt={camp.facltNm || "캠핑장 이미지"}
                      className="w-full h-full rounded-lg object-cover"
                    />
                </div>
                <div className="flex-1">
                    <div>
                        <h1 className="text-xl font-bold mt-3 mb-5">{camp.facltNm}</h1>
                    </div>
                    
                    <InfoRow 
                        icon={MapPin} 
                        label="주소" 
                        value={`${camp.addr1} ${camp.addr2}`} 
                    />
                    <InfoRow 
                        icon={Phone} 
                        label="전화번호" 
                        value={camp.tel} 
                    />
                    <InfoRow 
                        icon={Globe} 
                        label="링크" 
                        links={[
                            { text: "홈페이지", url: camp.homepage },
                            { text: "예약", url: camp.resveUrl }
                        ].filter(link => link.url && link.url !== 'undefined')} // 유효한 링크만 필터링
                    />
                    <InfoRow 
                        icon={Calendar} 
                        label="운영기간[요일]" 
                        value={`${camp.operPdCl} [ ${camp.operDeCl} ]`} 
                    />
                    
                    <InfoRow
                        icon={Layers}
                        label="사이트"
                        value={`잔디(${camp.siteBottomCl1}), 파쇄석(${camp.siteBottomCl2}), 테크(${camp.siteBottomCl3}), 자갈(${camp.siteBottomCl4}), 맨흙(${camp.siteBottomCl5})`}
                    />
                    <InfoRow
                        icon={Droplets}
                        label="세면시설"
                        value={`화장실(${camp.toiletCo}), 샤워실(${camp.swrmCo}), 개수대(${camp.wtrplCo})`}
                    />
                    <InfoRow 
                        icon={Building} 
                        label="편의시설" 
                        value={camp.sbrsCl} 
                    />
                </div>
            </div>
            
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">캠핑장 소개</h2>
                <p className="text-gray-700">{camp.intro || "소개 정보가 없습니다."}</p>
            </div>
        </div>
    );
}

export default CampDetail;