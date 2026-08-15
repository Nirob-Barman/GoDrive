import { useState } from "react";
import type { FormEvent } from "react";
import {
  useChangeUserRoleMutation,
  useGetUsersQuery,
  useSetUserActiveStatusMutation,
} from "../../redux/features/users/adminUsersApi";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
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
        <p>
          {user.email} &middot; {user.phoneNumber ?? "No phone"}
        </p>
        <p>
          {user.role} &middot; {user.isActive ? "Active" : "Blocked"}
        </p>
        {error && <p className="form-error">{getErrorMessage(error)}</p>}
      </div>

      <div className="reservation-actions">
        <button
          type="button"
          onClick={() => setActiveStatus({ userId: user.userId, isActive: !user.isActive })}
          disabled={isTogglingActive}
        >
          {user.isActive ? "Block" : "Activate"}
        </button>
        <button
          type="button"
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
      <h1>Manage Users</h1>

      <form className="car-filters" onSubmit={handleSearchSubmit}>
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
        <button type="submit">Search</button>
      </form>

      {isLoading && <p>Loading users...</p>}

      <ul className="reservation-list">
        {data?.items.map((user) => (
          <UserRow key={user.userId} user={user} isSelf={user.userId === currentUser?.userId} />
        ))}
      </ul>

      {data && data.items.length === 0 && <p>No users match this filter.</p>}

      {data && data.totalPages > 1 && (
        <div className="pagination">
          <button type="button" disabled={pageNumber <= 1 || isFetching} onClick={() => setPageNumber((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {data.pageNumber} of {data.totalPages}
          </span>
          <button
            type="button"
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
