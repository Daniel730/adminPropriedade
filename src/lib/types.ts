export type Role = "TENANT" | "MANAGER" | "VENDOR"

export type RequestStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED"

export type SubscriptionStatus = "ACTIVE" | "GRACE" | "RESTRICTED"

export type NotificationType = "STATUS_CHANGE" | "VENDOR_ASSIGNED" | "BILLING"

export const RequestStatus = {
  OPEN: "OPEN" as RequestStatus,
  IN_PROGRESS: "IN_PROGRESS" as RequestStatus,
  RESOLVED: "RESOLVED" as RequestStatus,
}

export const Role = {
  TENANT: "TENANT" as Role,
  MANAGER: "MANAGER" as Role,
  VENDOR: "VENDOR" as Role,
}

export const SubscriptionStatus = {
  ACTIVE: "ACTIVE" as SubscriptionStatus,
  GRACE: "GRACE" as SubscriptionStatus,
  RESTRICTED: "RESTRICTED" as SubscriptionStatus,
}

export const NotificationType = {
  STATUS_CHANGE: "STATUS_CHANGE" as NotificationType,
  VENDOR_ASSIGNED: "VENDOR_ASSIGNED" as NotificationType,
  BILLING: "BILLING" as NotificationType,
}
