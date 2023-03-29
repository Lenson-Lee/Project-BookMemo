import { NextApiRequest, NextApiResponse } from "next";
import MemberModel from "@/models/member/member.model";

async function add(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body;
  if (uid === undefined || uid === null) {
    return res.status(400).json({ result: false, message: "uid가 없어요" });
  }
  if (email === undefined || email === null) {
    return res.status(400).json({ result: false, message: "email가 없어요" });
  }

  // addresult 과정은 성공했지만 screenName 과정에서 실패하면 전부 돌아가야함 > transaction
  const addResult = await MemberModel.add({
    uid,
    email,
    displayName,
    photoURL,
  });
  if (addResult.result === true) {
    return res.status(200).json(addResult);
  }
  res.status(500).json(addResult);
}

async function findByScreenName(req: NextApiRequest, res: NextApiResponse) {
  /**파일을 만들때 api/user.info/[screenName]에서 찾아서 query로 들어옴 쿼리로 들어오면 string 혹은 string[]로 들어옴**/
  const { screenName } = req.query;
  if (screenName === undefined || screenName === null) {
    console.error("screenName이 누락되었어요.");
  }
  //findByScreenName(screenName)이 Array일 수도 있음
  const extractScreenName = Array.isArray(screenName)
    ? screenName[0]
    : screenName;
  const findResult = await MemberModel.findByScreenName(extractScreenName!);

  if (findResult === null) {
    return res.status(404).end();
  }
  res.status(200).json(findResult);
}

const MemberCtrl = {
  add,
  findByScreenName,
};

export default MemberCtrl;
