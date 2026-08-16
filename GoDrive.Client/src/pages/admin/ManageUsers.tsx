import { useState } from "react";
import type { FormEvent } from "react";
import {
  useChangeUserRoleMutation,
  useGetUsersQuery,
  useSetUserActiveStatusMutation,
} from "../../redux/features/users/adminUsersApi";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { ActiveStatusBadge, RoleBadge } from "../../components/ui/StatusBadge";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonRows } from "../../components/ui/Skeleton";
import type { TUserSummary } from "../../types/users";
import { getErrorMessage } from "../../utils/getErrorMessage";

function UserRow({ user, isSelf }: { user: TUserSummary; isSelf: boolean }) {
  const [setActiveStatus, { isLoading: isTogglingActive, error: activeError }] = useSetUserActiveStatusMutation();
  const [changeRole, { isLoading: isChangingRole, error: roleError }] = useChangeUserRoleMutation();

  const error = activeError ?? roleError;

  return (
    <li className="reservation-row">
      <div>
        <h2>{user.fullName}</h2>
        <p className="text-sm text-muted">
          {user.email} &middot; {user.phoneNumber ?? "No phone"}
        </p>
        <div className="reservation-meta-row">
          <RoleBadge role={user.role} />
          <ActiveStatusBadge isActive={user.isActive} />
        </div>
        {error && <p className="form-error">{getErrorMessage(error)}</p>}
      </div>

      <div className="reservation-actions">
        <button
          type="button"
          className={`btn btn-sm${user.isActive ? " btn-danger" : ""}`}
          onClick={() => setActiveStatus({ userId: user.userId, isActive: !user.isActive })}
          disabled={isTogglingActive}
        >
          {user.isActive ? "Block" : "Activate"}
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => changeRole({ userId: user.userId, role: user.role === "Admin" ? "User" : "Admin" })}
          disabled={isChangingRole || isSelf}
          title={isSelf ? "You cannot change your own role" : undefined}
        >
          Make {user.role === "Admin" ? "User" : "Admin"}
        </button>
      </div>
    </li>
  );
}

export default function ManageUsers() {
  const currentUser = useAppSelector(selectCurrentUser);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<"" | "true" | "false">("");
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isFetching } = useGetUsersQuery({
    search: appliedSearch || undefined,
    isActive: isActiveFilter === "" ? undefined : isActiveFilter === "true",
    pageNumber,
    pageSize: 20,
  });

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    setAppliedSearch(search);
    setPageNumber(1);
  };

  return (
    <div>
      <PageHeader title="Manage Users" subtitle="Search, block/activate accounts, and change roles." />

      <form className="admin-filter-bar" onSubmit={handleSearchSubmit}>
        <input placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select
          value={isActiveFilter}
          onChange={(e) => {
            setIsActiveFilter(e.target.value as "" | "true" | "false");
            setPageNumber(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Blocked</option>
        </select>
        <button type="submit" className="btn">
          Search
        </button>
      </form>

      {isLoading && <SkeletonRows count={4} />}

      {data && data.items.length === 0 && <EmptyState title="No users match this filter" />}

      {data && data.items.length > 0 && (
        <ul className="reservation-list">
          {data.items.map((user) => (
            <UserRow key={user.userId} user={user} isSelf={user.userId === currentUser?.userId} />
          ))}
        </ul>
      )}

      {data && data.totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="btn btn-sm"
            disabled={pageNumber <= 1 || isFetching}
            onClick={() => setPageNumber((p) => p - 1)}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {data.pageNumber} of {data.totalPages}
          </span>
          <button
            type="button"
            className="btn btn-sm"
            disabled={pageNumber >= data.totalPages || isFetching}
            onClick={() => setPageNumber((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
