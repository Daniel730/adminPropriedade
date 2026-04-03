import { RequestStatus } from "./types"

export const ALLOWED_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: ["OPEN"],
}

export function validateTransition(
  from: RequestStatus,
  to: RequestStatus
): boolean {
  const allowed = ALLOWED_TRANSITIONS[from]
  return allowed.includes(to)
}

export function getAllowedNextStatuses(current: RequestStatus): RequestStatus[] {
  return ALLOWED_TRANSITIONS[current] ?? []
}
