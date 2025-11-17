import { GoogleGenAI } from "@google/genai";

export const generateReviewSummary = async (cafeName: string, menu: string, rating: number): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API 키가 설정되지 않았습니다. 환경 변수에 Gemini API 키를 추가해주세요.";
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    당신은 커플의 카페 다이어리를 위한 창의적인 작가입니다.
    다음 정보를 바탕으로 짧고, 다정하며, 개인적인 한 문장 리뷰 요약을 작성해주세요.
    - 카페 이름: "${cafeName}"
    - 주문 메뉴: "${menu}"
    - 별점: 5점 만점에 ${rating}점
    
    공유된 추억처럼 들리게 만들어주세요.
    5점 예시: "우리의 새로운 최애 장소! ${cafeName}의 헤이즐넛 라떼는 완벽 그 자체였어."
    3점 예시: "${cafeName} 분위기는 아늑했지만, 플랫 화이트는 그냥 그랬네."
    1점 예시: "${cafeName}은 다음엔 건너뛰어야겠다. 우리 스타일은 아니었어."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("리뷰 요약 생성 중 오류 발생:", error);
    return "죄송합니다, 지금은 요약을 생성할 수 없습니다.";
  }
};