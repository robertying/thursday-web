export const isLearnXUser = (userId?: string) =>
  !userId || userId === process.env.NEXT_PUBLIC_LEARNX_USER_ID;
