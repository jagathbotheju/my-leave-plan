import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
  expiresIn: string;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "1d",
};

export const signJwt = (
  payload: JwtPayload,
  option: SignOption = DEFAULT_SIGN_OPTION
) => {
  const secretKey = process.env.JWT_USER_ID_SECRET as string;
  const token = jwt.sign(payload, secretKey);
  return token;
};

export const verifyJwt = (token: string) => {
  try {
    const secretKey = process.env.JWT_USER_ID_SECRET as string;
    const decoded = jwt.verify(token, secretKey);
    return decoded as JwtPayload;
  } catch (error) {
    return null;
  }
};
