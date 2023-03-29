export default class CustomServerError extends Error {
  public statusCode: number; //ex ) 200,201, 400, 500...

  public location?: string; //300번대 에러에서 리다이렌션할때 사용

  constructor({
    statusCode = 500,
    message,
    location,
  }: {
    statusCode?: number;
    message: string;
    location?: string;
  }) {
    super(message); //super로 에러를 컨트롤러에 전달
    this.statusCode = statusCode;
    this.location = location;
  }

  //에러 처리를 할 때 동일하게 어떤 에러가 났는지 확인
  serializeErrors(): { message: string } | string {
    return { message: this.message };
  }
}
