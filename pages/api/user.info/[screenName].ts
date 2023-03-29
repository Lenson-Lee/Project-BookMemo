//  파이어베이스 저장소에 멤버 추가
//  member.ctrl에서 자주 쓰이는 업무 수행
import { NextApiRequest, NextApiResponse } from "next";
import MemberModel from "@/models/member/member.model";
import MemberCtrl from "@/controllers/member.ctrl";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const supportMethod = ["GET"];
  try {
    await MemberCtrl.findByScreenName(req, res);
  } catch (err) {
    console.error(err);
  }
}
