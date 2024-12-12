export function shortAddress(address?: string, numOfShow = 4) {
  if (!address) return "";
  const tmpAddress = address.trim();
  if (tmpAddress.length <= 22) return tmpAddress;

  return `${tmpAddress.substring(0, numOfShow)}...${tmpAddress.substring(tmpAddress.length - numOfShow, tmpAddress.length)}`;
}

export const formatNumber = (number?: string | number, behind = 5) => {
  if (number === undefined) return "";
  if (number === "0" || Number(number) === 0) {
    return "0";
  }
  const min = 1 / Math.pow(10, behind);
  if (Math.abs(Number(number)) < min) return `< 0.${"0".repeat(behind - 1)}1`;
  let value = number.toString();
  if (value.includes(".") || value.includes(",")) {
    value = value.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    const [frontDot, behindDot] = value.split(".");
    const tmpSub = (behindDot ? Number(`0.${behindDot}`) + 0.0000001 : "").toString().split(".")[1] || "";

    const sub = tmpSub.substring(0, behind).replace(/(0+)$/, "");

    value = `${frontDot}${sub ? "." : ""}${sub}`;
  } else {
    value = value.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  }

  return value;
};

export function getTimeDurationLabel(time: number) {
  if (time === 0) return "0s";
  if (time < 60) return `${time}s`;
  const m = Math.floor(time / 60);
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60 ? `${m % 60}m` : ""}`;
}

export function formatSeconds(sec?: number): string {
  if (!sec) {
    return "";
  }
  if (sec < 60) {
    return `${sec.toString().padStart(2, "0")}s`;
  }
  if (sec < 3600) {
    return `${Math.floor(sec / 60)
      .toString()
      .padStart(2, "0")}m${formatSeconds(sec % 60)}`;
  }
  return `${Math.floor(sec / 3600)
    .toString()
    .padStart(2, "0")}h${formatSeconds(sec % 3600)}`;
}
