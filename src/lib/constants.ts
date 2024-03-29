import moment from "moment";

export const months = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUN",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export const START_DATE = `${moment().year()}-${1}-${1}`;
export const END_DATE = `${moment().year() + 1}-${2}-${1}`;
