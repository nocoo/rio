export type LivePayload = {
  status: "ok";
  name: "rio";
  version: string;
};

export function createLivePayload(version: string): LivePayload {
  return { status: "ok", name: "rio", version };
}
