import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "../../redux/features/users/usersApi";
import {
  useChangePasswordMutation,
  useLogoutMutation,
  useRevokeAllTokensMutation,
} from "../../redux/features/auth/authApi";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/features/auth/authSlice";
import PageHeader from "../../components/ui/PageHeader";
import { SkeletonRows } from "../../components/ui/Skeleton";
import { getErrorMessage } from "../../utils/getErrorMessage";

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePassword, { isLoading, error, data: message }] = useChangePasswordMutation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = await changePassword({ currentPassword, newPassword, confirmNewPassword })
      .unwrap()
      .catch(() => null);

    if (result) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  return (
    <div>
      <h3>Change Password</h3>
      <form onSubmit={handleSubmit} className="field-group">
        <label>
          Current password
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          New password
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </label>
        <label>
          Confirm new password
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="form-error">{getErrorMessage(error)}</p>}
        {message && <p className="form-success">{message}</p>}

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

function LogOutEverywhereSection() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [revokeAllTokens, { isLoading }] = useRevokeAllTokensMutation();
  const [logoutRequest] = useLogoutMutation();

  const handleClick = async () => {
    // Revokes every active refresh token for this account, including this browser's own -
    // treat it exactly like a local logout too, not just a background session cleanup.
    await revokeAllTokens().unwrap().catch(() => null);
    await logoutRequest().catch(() => undefined);
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ marginTop: "var(--space-5)" }}>
      <h3>Sessions</h3>
      <p className="form-section-hint">Log out of every device where you're currently signed in, including this one.</p>
      <button type="button" className="btn btn-danger" onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Logging out everywhere..." : "Log Out Everywhere"}
      </button>
    </div>
  );
}

export default function Profile() {
  const { data: profile, isLoading } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isSaving, error, isSuccess }] = useUpdateMyProfileMutation();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [nidOrPassportNumber, setNidOrPassportNumber] = useState("");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("");

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.fullName);
    setPhoneNumber(profile.phoneNumber ?? "");
    setAddress(profile.address ?? "");
    setNidOrPassportNumber(profile.nidOrPassportNumber ?? "");
    setDrivingLicenseNumber(profile.drivingLicenseNumber ?? "");
  }, [profile]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateProfile({
      fullName,
      phoneNumber: phoneNumber || undefined,
      address: address || undefined,
      nidOrPassportNumber: nidOrPassportNumber || undefined,
      drivingLicenseNumber: drivingLicenseNumber || undefined,
    });
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="My Profile" />
        <SkeletonRows count={3} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="A National ID/Passport number and Driving License number are required before you can book a car."
      />

      <form onSubmit={handleSubmit} className="field-group" style={{ maxWidth: "640px" }}>
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="field-group">
            <label>
              Full name
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </label>
            <label>
              Phone number
              <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </label>
            <label>
              Address
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>Identity &amp; Driving Information</h2>
          <div className="field-group">
            <label>
              NID / Passport number
              <input
                type="text"
                value={nidOrPassportNumber}
                onChange={(e) => setNidOrPassportNumber(e.target.value)}
              />
            </label>
            <label>
              Driving license number
              <input
                type="text"
                value={drivingLicenseNumber}
                onChange={(e) => setDrivingLicenseNumber(e.target.value)}
              />
            </label>
          </div>
        </div>

        {error && <p className="form-error">{getErrorMessage(error)}</p>}
        {isSuccess && <p className="form-success">Profile saved.</p>}

        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </button>
      </form>

      <div className="form-section" style={{ maxWidth: "640px" }}>
        <h2>Security</h2>
        <ChangePasswordSection />
        <LogOutEverywhereSection />
      </div>
    </div>
  );
}
