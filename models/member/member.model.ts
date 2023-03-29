import FirebaseAdmin from "../firebase_admin";
import { InAuthUser } from "../in_auth_user";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MEMBER_COL = "members";
const SCR_NAME_COL = "screen_names";

/** Promise 길어서 타입으로 뺐당 */
type AddResult =
  | { result: true; id: string }
  | { result: false; message: string };

/** firebase 입력 후 mysql에도 입력 */
async function add({
  uid,
  displayName,
  email,
  photoURL,
}: InAuthUser): Promise<AddResult> {
  try {
    /** abc@gmail.com 과 abc@naver.com 둘 다 스크린네임이 abc이게 되니 구분해야한다. */
    let split = (email as string).split("@");
    const screenName = split[0] + "." + split[1].split(".com")[0];

    const addResult =
      await FirebaseAdmin.getInstance().Firestore.runTransaction(
        async (transaction: any) => {
          const memberRef = FirebaseAdmin.getInstance()
            .Firestore.collection(MEMBER_COL)
            .doc(uid);
          const screenNameRef = FirebaseAdmin.getInstance()
            .Firestore.collection(SCR_NAME_COL)
            .doc(screenName);
          const memberDoc = await transaction.get(memberRef);
          if (memberDoc.exists) {
            // 이미 추가된 상태
            console.log("이미 있는 이름", screenName);
            return false;
          }

          const addData = {
            uid,
            email,
            displayName: displayName ?? "",
            photoURL: photoURL ?? "",
          };
          await transaction.set(memberRef, addData);
          await transaction.set(screenNameRef, addData);
          return true;
        }
      );
    if (addResult === false) {
      return { result: true, id: uid };
    }

    //addResult === true : 계정 생성 완료(중복계정 없음)
    // Mysql에 데이터 저장
    console.log("파이어베이스에서 만든 uid : ", uid);
    const document = await prisma.user.create({ data: { uid: uid } });
    console.log("member.model에서 prisma memberadd 성공", document);

    return { result: true, id: uid };
  } catch (err) {
    console.error("에러 발생 : ", err);
    /** server side쪽의 에러 */
    return { result: false, message: "서버에러" };
  }
}

/** 사용자 페이지 이동을 위한 정보 조회 **/
async function findByScreenName(
  screenName: string
): Promise<InAuthUser | null> {
  const memberRef = FirebaseAdmin.getInstance()
    .Firestore.collection(SCR_NAME_COL)
    .doc(screenName);
  const memberDoc = await memberRef.get();
  if (memberDoc.exists === false) {
    return null;
  }
  const data = memberDoc.data() as InAuthUser; //이미 타입캐스트가 되어있음
  return data;
}

const MemberModel = {
  add,
  findByScreenName,
};

export default MemberModel;
