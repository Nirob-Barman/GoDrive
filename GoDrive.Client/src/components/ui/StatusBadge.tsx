type TBadgeVariant = "success" | "warning" | "error" | "info" | "neutral" | "primary";

const RESERVATION_STATUS_VARIANTS: Record<string, TBadgeVariant> = {
  Pending: "warning",
  Approved: "primary",
  PickedUp: "info",
  Returned: "success",
  Rejected: "error",
  Cancelled: "neutral",
};

const PAYMENT_STATUS_VARIANTS: Record<string, TBadgeVariant> = {
  Unpaid: "warning",
  Paid: "success",
  Refunded: "info",
  Failed: "error",
};

const CAR_STATUS_VARIANTS: Record<string, TBadgeVariant> = {
  Active: "success",
  Inactive: "neutral",
  Maintenance: "warning",
};

function StatusBadge({ status, variant }: { status: string; variant: TBadgeVariant }) {
  return <span className={`badge badge-${variant}`}>{status}</span>;
}

export function ReservationStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} variant={RESERVATION_STATUS_VARIANTS[status] ?? "neutral"} />;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} variant={PAYMENT_STATUS_VARIANTS[status] ?? "neutral"} />;
}

export function CarStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} variant={CAR_STATUS_VARIANTS[status] ?? "neutral"} />;
}

export function RoleBadge({ role }: { role: string }) {
  return <StatusBadge status={role} variant={role === "Admin" ? "primary" : "neutral"} />;
}

export function ActiveStatusBadge({ isActive }: { isActive: boolean }) {
  return <StatusBadge status={isActive ? "Active" : "Blocked"} variant={isActive ? "success" : "error"} />;
}
