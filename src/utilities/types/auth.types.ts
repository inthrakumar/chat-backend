export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayload = {
  email: string;
  id: string;
};

export type JwtRTPayload = {
  id: string;
  email: string;
  refreshToken: string;
};

export type LoginPayload = JwtPayload & {
  id: string;
  email: string;
};
export type CassaandraConnectionData = {
  contactPoints: string;
  keyspace: string;
  localDataCenter: string;
};
